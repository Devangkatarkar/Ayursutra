import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-3066d3c4/health", (c) => {
  return c.json({ status: "ok" });
});

// Authentication endpoints

// Sign up new user
app.post("/make-server-3066d3c4/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, userData } = body;

    if (!email || !password || !userData) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: userData,
      email_confirm: true // Auto-confirm since no email server configured
    });

    if (authError) {
      console.log(`Auth error during signup: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    if (!authData.user) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    // Store additional user data in KV store
    const userProfile = {
      id: authData.user.id,
      email: authData.user.email,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const userKey = `user:${authData.user.id}`;
    await kv.set(userKey, userProfile);

    // Add to role-based lists
    const roleKey = `${userData.role}s`;
    const roleList = await kv.get(roleKey) || [];
    roleList.push(authData.user.id);
    await kv.set(roleKey, roleList);

    console.log(`New ${userData.role} registered: ${authData.user.email}`);
    return c.json({ 
      success: true, 
      user: {
        id: authData.user.id,
        email: authData.user.email,
        ...userData
      }
    });
  } catch (error) {
    console.log(`Error during signup: ${error}`);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Sign in user
app.post("/make-server-3066d3c4/auth/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.log(`Auth error during signin: ${authError.message}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    if (!authData.user || !authData.session) {
      return c.json({ error: "Authentication failed" }, 401);
    }

    // Get user profile from KV store
    const userKey = `user:${authData.user.id}`;
    const userProfile = await kv.get(userKey);

    if (!userProfile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    console.log(`User signed in: ${authData.user.email}`);
    return c.json({ 
      success: true, 
      user: userProfile,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token
      }
    });
  } catch (error) {
    console.log(`Error during signin: ${error}`);
    return c.json({ error: "Sign in failed" }, 500);
  }
});

// Get user profile
app.get("/make-server-3066d3c4/auth/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userKey = `user:${userId}`;
    const userProfile = await kv.get(userKey);

    if (!userProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user: userProfile });
  } catch (error) {
    console.log(`Error getting user profile: ${error}`);
    return c.json({ error: "Failed to get user profile" }, 500);
  }
});

// Therapy request and scheduling endpoints

// Submit therapy request
app.post("/make-server-3066d3c4/therapy/request", async (c) => {
  try {
    const body = await c.req.json();
    const { patientId, therapyType, urgency, symptoms, notes, preferredDoctorId } = body;

    if (!patientId || !therapyType) {
      return c.json({ error: "Patient ID and therapy type are required" }, 400);
    }

    const therapyRequest = {
      id: crypto.randomUUID(),
      patientId,
      therapyType,
      urgency: urgency || 'medium',
      symptoms: symptoms || [],
      notes: notes || '',
      preferredDoctorId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      assignedDoctorId: null,
      scheduledDate: null,
      scheduledTime: null
    };

    const requestKey = `therapy_request:${therapyRequest.id}`;
    await kv.set(requestKey, therapyRequest);

    // Add to patient's requests
    const patientRequestsKey = `patient_therapy_requests:${patientId}`;
    const patientRequests = await kv.get(patientRequestsKey) || [];
    patientRequests.push(therapyRequest.id);
    await kv.set(patientRequestsKey, patientRequests);

    // Add to pending requests queue
    const pendingRequestsKey = 'pending_therapy_requests';
    const pendingRequests = await kv.get(pendingRequestsKey) || [];
    pendingRequests.push(therapyRequest.id);
    await kv.set(pendingRequestsKey, pendingRequests);

    // Send notification to doctors
    const doctorsKey = 'doctors';
    const doctorIds = await kv.get(doctorsKey) || [];
    
    for (const doctorId of doctorIds) {
      // Skip if patient has preferred doctor and this isn't that doctor
      if (preferredDoctorId && doctorId !== preferredDoctorId) continue;
      
      const notification = {
        id: crypto.randomUUID(),
        userId: doctorId,
        type: 'therapy_request',
        priority: urgency,
        message: `New ${therapyType} therapy request from patient`,
        data: {
          requestId: therapyRequest.id,
          patientId,
          therapyType,
          urgency
        },
        timestamp: new Date().toISOString(),
        read: false
      };

      const notificationKey = `notification:${notification.id}`;
      await kv.set(notificationKey, notification);

      const doctorNotificationsKey = `user_notifications:${doctorId}`;
      const doctorNotifications = await kv.get(doctorNotificationsKey) || [];
      doctorNotifications.push(notification.id);
      await kv.set(doctorNotificationsKey, doctorNotifications);
    }

    console.log(`Therapy request created: ${therapyRequest.id} for patient ${patientId}`);
    return c.json({ success: true, requestId: therapyRequest.id });
  } catch (error) {
    console.log(`Error creating therapy request: ${error}`);
    return c.json({ error: "Failed to create therapy request" }, 500);
  }
});

// Accept therapy request (doctor)
app.post("/make-server-3066d3c4/therapy/accept", async (c) => {
  try {
    const body = await c.req.json();
    const { requestId, doctorId, scheduledDate, scheduledTime, treatmentPlan } = body;

    if (!requestId || !doctorId || !scheduledDate || !scheduledTime) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const requestKey = `therapy_request:${requestId}`;
    const therapyRequest = await kv.get(requestKey);

    if (!therapyRequest) {
      return c.json({ error: "Therapy request not found" }, 404);
    }

    if (therapyRequest.status !== 'pending') {
      return c.json({ error: "Request is no longer available" }, 400);
    }

    // Update therapy request
    therapyRequest.status = 'accepted';
    therapyRequest.assignedDoctorId = doctorId;
    therapyRequest.scheduledDate = scheduledDate;
    therapyRequest.scheduledTime = scheduledTime;
    therapyRequest.treatmentPlan = treatmentPlan || '';
    therapyRequest.acceptedAt = new Date().toISOString();

    await kv.set(requestKey, therapyRequest);

    // Remove from pending requests
    const pendingRequestsKey = 'pending_therapy_requests';
    const pendingRequests = await kv.get(pendingRequestsKey) || [];
    const updatedPendingRequests = pendingRequests.filter(id => id !== requestId);
    await kv.set(pendingRequestsKey, updatedPendingRequests);

    // Add to doctor's accepted requests
    const doctorRequestsKey = `doctor_therapy_requests:${doctorId}`;
    const doctorRequests = await kv.get(doctorRequestsKey) || [];
    doctorRequests.push(requestId);
    await kv.set(doctorRequestsKey, doctorRequests);

    // Send notification to patient
    const patientNotification = {
      id: crypto.randomUUID(),
      userId: therapyRequest.patientId,
      type: 'therapy_accepted',
      priority: 'high',
      message: `Your ${therapyRequest.therapyType} therapy has been scheduled`,
      data: {
        requestId,
        doctorId,
        scheduledDate,
        scheduledTime,
        therapyType: therapyRequest.therapyType
      },
      timestamp: new Date().toISOString(),
      read: false
    };

    const patientNotificationKey = `notification:${patientNotification.id}`;
    await kv.set(patientNotificationKey, patientNotification);

    const patientNotificationsKey = `user_notifications:${therapyRequest.patientId}`;
    const patientNotifications = await kv.get(patientNotificationsKey) || [];
    patientNotifications.push(patientNotification.id);
    await kv.set(patientNotificationsKey, patientNotifications);

    console.log(`Therapy request ${requestId} accepted by doctor ${doctorId}`);
    return c.json({ success: true, therapyRequest });
  } catch (error) {
    console.log(`Error accepting therapy request: ${error}`);
    return c.json({ error: "Failed to accept therapy request" }, 500);
  }
});

// Get pending therapy requests (for doctors)
app.get("/make-server-3066d3c4/therapy/pending", async (c) => {
  try {
    const pendingRequestsKey = 'pending_therapy_requests';
    const pendingRequestIds = await kv.get(pendingRequestsKey) || [];

    const requests = [];
    for (const requestId of pendingRequestIds) {
      const requestKey = `therapy_request:${requestId}`;
      const request = await kv.get(requestKey);
      if (request && request.status === 'pending') {
        // Get patient info
        const patientKey = `user:${request.patientId}`;
        const patientInfo = await kv.get(patientKey);
        request.patientInfo = patientInfo ? {
          name: patientInfo.name,
          age: patientInfo.age,
          therapyPlan: patientInfo.therapyPlan
        } : null;
        requests.push(request);
      }
    }

    // Sort by urgency and creation time
    requests.sort((a, b) => {
      const urgencyOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return c.json({ requests });
  } catch (error) {
    console.log(`Error getting pending therapy requests: ${error}`);
    return c.json({ error: "Failed to get pending requests" }, 500);
  }
});

// Get doctor's therapy requests
app.get("/make-server-3066d3c4/doctor/:doctorId/therapy-requests", async (c) => {
  try {
    const doctorId = c.req.param("doctorId");
    
    const doctorRequestsKey = `doctor_therapy_requests:${doctorId}`;
    const requestIds = await kv.get(doctorRequestsKey) || [];

    const requests = [];
    for (const requestId of requestIds) {
      const requestKey = `therapy_request:${requestId}`;
      const request = await kv.get(requestKey);
      if (request) {
        // Get patient info
        const patientKey = `user:${request.patientId}`;
        const patientInfo = await kv.get(patientKey);
        request.patientInfo = patientInfo ? {
          name: patientInfo.name,
          phone: patientInfo.phone,
          therapyPlan: patientInfo.therapyPlan
        } : null;
        requests.push(request);
      }
    }

    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ requests });
  } catch (error) {
    console.log(`Error getting doctor therapy requests: ${error}`);
    return c.json({ error: "Failed to get therapy requests" }, 500);
  }
});

// Get patient's therapy requests
app.get("/make-server-3066d3c4/patient/:patientId/therapy-requests", async (c) => {
  try {
    const patientId = c.req.param("patientId");
    
    const patientRequestsKey = `patient_therapy_requests:${patientId}`;
    const requestIds = await kv.get(patientRequestsKey) || [];

    const requests = [];
    for (const requestId of requestIds) {
      const requestKey = `therapy_request:${requestId}`;
      const request = await kv.get(requestKey);
      if (request) {
        // Get doctor info if assigned
        if (request.assignedDoctorId) {
          const doctorKey = `user:${request.assignedDoctorId}`;
          const doctorInfo = await kv.get(doctorKey);
          request.doctorInfo = doctorInfo ? {
            name: doctorInfo.name,
            specialization: doctorInfo.specialization,
            phone: doctorInfo.phone
          } : null;
        }
        requests.push(request);
      }
    }

    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ requests });
  } catch (error) {
    console.log(`Error getting patient therapy requests: ${error}`);
    return c.json({ error: "Failed to get therapy requests" }, 500);
  }
});

// Submit patient health feedback
app.post("/make-server-3066d3c4/feedback", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, symptoms, painLevel, energyLevel, digestiveIssues, sleepQuality, mood, complications, notes, medications, therapyPhase } = body;

    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const feedback = {
      id: crypto.randomUUID(),
      userId,
      timestamp: new Date().toISOString(),
      symptoms: symptoms || [],
      painLevel: painLevel || 0,
      energyLevel: energyLevel || 0,
      digestiveIssues: digestiveIssues || [],
      sleepQuality: sleepQuality || 0,
      mood: mood || 0,
      complications: complications || [],
      notes: notes || "",
      medications: medications || [],
      therapyPhase: therapyPhase || "",
      status: "pending_review"
    };

    const feedbackKey = `feedback:${userId}:${feedback.id}`;
    await kv.set(feedbackKey, feedback);

    // Also store in user's feedback list
    const userFeedbackKey = `user_feedback:${userId}`;
    const existingFeedback = await kv.get(userFeedbackKey) || [];
    existingFeedback.push(feedback.id);
    await kv.set(userFeedbackKey, existingFeedback);

    // Get patient info
    const patientKey = `user:${userId}`;
    const patientInfo = await kv.get(patientKey);

    // Notify all doctors about new feedback
    const doctorsKey = 'doctors';
    const doctorIds = await kv.get(doctorsKey) || [];
    
    for (const doctorId of doctorIds) {
      const notification = {
        id: crypto.randomUUID(),
        userId: doctorId,
        type: 'patient_feedback',
        priority: complications && complications.length > 0 ? 'high' : 'medium',
        message: `New health feedback from ${patientInfo?.name || 'patient'}`,
        data: {
          feedbackId: feedback.id,
          patientId: userId,
          patientName: patientInfo?.name,
          hasComplications: complications && complications.length > 0,
          painLevel,
          symptoms: symptoms.slice(0, 3) // Show first 3 symptoms
        },
        timestamp: new Date().toISOString(),
        read: false
      };

      const notificationKey = `notification:${notification.id}`;
      await kv.set(notificationKey, notification);

      const doctorNotificationsKey = `user_notifications:${doctorId}`;
      const doctorNotifications = await kv.get(doctorNotificationsKey) || [];
      doctorNotifications.push(notification.id);
      await kv.set(doctorNotificationsKey, doctorNotifications);
    }

    console.log(`Health feedback submitted for user ${userId}: ${feedback.id}`);
    return c.json({ success: true, feedbackId: feedback.id });
  } catch (error) {
    console.log(`Error submitting feedback: ${error}`);
    return c.json({ error: "Failed to submit feedback" }, 500);
  }
});

// Get patient feedback history
app.get("/make-server-3066d3c4/feedback/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    const userFeedbackKey = `user_feedback:${userId}`;
    const feedbackIds = await kv.get(userFeedbackKey) || [];
    
    const feedbackList = [];
    for (const feedbackId of feedbackIds) {
      const feedbackKey = `feedback:${userId}:${feedbackId}`;
      const feedback = await kv.get(feedbackKey);
      if (feedback) {
        feedbackList.push(feedback);
      }
    }

    // Sort by timestamp descending
    feedbackList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return c.json({ feedback: feedbackList });
  } catch (error) {
    console.log(`Error retrieving feedback for user: ${error}`);
    return c.json({ error: "Failed to retrieve feedback" }, 500);
  }
});

// Update feedback status (for doctors)
app.put("/make-server-3066d3c4/feedback/:userId/:feedbackId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const feedbackId = c.req.param("feedbackId");
    const body = await c.req.json();
    const { status, doctorNotes, prescriptionChanges, doctorId } = body;

    const feedbackKey = `feedback:${userId}:${feedbackId}`;
    const feedback = await kv.get(feedbackKey);
    
    if (!feedback) {
      return c.json({ error: "Feedback not found" }, 404);
    }

    feedback.status = status || feedback.status;
    feedback.doctorNotes = doctorNotes || feedback.doctorNotes;
    feedback.prescriptionChanges = prescriptionChanges || feedback.prescriptionChanges;
    feedback.reviewedAt = new Date().toISOString();
    feedback.reviewedBy = doctorId;

    await kv.set(feedbackKey, feedback);

    console.log(`Feedback ${feedbackId} updated for user ${userId} by doctor ${doctorId}`);
    return c.json({ success: true, feedback });
  } catch (error) {
    console.log(`Error updating feedback: ${error}`);
    return c.json({ error: "Failed to update feedback" }, 500);
  }
});

// Create appointment
app.post("/make-server-3066d3c4/appointments", async (c) => {
  try {
    const body = await c.req.json();
    const { patientId, doctorId, date, time, type, notes } = body;

    if (!patientId || !doctorId || !date || !time) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const appointment = {
      id: crypto.randomUUID(),
      patientId,
      doctorId,
      date,
      time,
      type: type || 'consultation',
      status: 'scheduled',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    const appointmentKey = `appointment:${appointment.id}`;
    await kv.set(appointmentKey, appointment);

    // Add to patient's appointments
    const patientAppointmentsKey = `patient_appointments:${patientId}`;
    const patientAppointments = await kv.get(patientAppointmentsKey) || [];
    patientAppointments.push(appointment.id);
    await kv.set(patientAppointmentsKey, patientAppointments);

    // Add to doctor's appointments
    const doctorAppointmentsKey = `doctor_appointments:${doctorId}`;
    const doctorAppointments = await kv.get(doctorAppointmentsKey) || [];
    doctorAppointments.push(appointment.id);
    await kv.set(doctorAppointmentsKey, doctorAppointments);

    console.log(`Appointment created: ${appointment.id} for patient ${patientId} with doctor ${doctorId}`);
    return c.json({ success: true, appointmentId: appointment.id });
  } catch (error) {
    console.log(`Error creating appointment: ${error}`);
    return c.json({ error: "Failed to create appointment" }, 500);
  }
});

// Get doctor's appointments
app.get("/make-server-3066d3c4/doctor/:doctorId/appointments", async (c) => {
  try {
    const doctorId = c.req.param("doctorId");
    
    const doctorAppointmentsKey = `doctor_appointments:${doctorId}`;
    const appointmentIds = await kv.get(doctorAppointmentsKey) || [];
    
    const appointments = [];
    for (const appointmentId of appointmentIds) {
      const appointmentKey = `appointment:${appointmentId}`;
      const appointment = await kv.get(appointmentKey);
      if (appointment) {
        appointments.push(appointment);
      }
    }

    // Sort by date and time
    appointments.sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

    return c.json({ appointments });
  } catch (error) {
    console.log(`Error retrieving doctor appointments: ${error}`);
    return c.json({ error: "Failed to retrieve appointments" }, 500);
  }
});

// Get patient's appointments
app.get("/make-server-3066d3c4/patient/:patientId/appointments", async (c) => {
  try {
    const patientId = c.req.param("patientId");
    
    const patientAppointmentsKey = `patient_appointments:${patientId}`;
    const appointmentIds = await kv.get(patientAppointmentsKey) || [];
    
    const appointments = [];
    for (const appointmentId of appointmentIds) {
      const appointmentKey = `appointment:${appointmentId}`;
      const appointment = await kv.get(appointmentKey);
      if (appointment) {
        appointments.push(appointment);
      }
    }

    appointments.sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

    return c.json({ appointments });
  } catch (error) {
    console.log(`Error retrieving patient appointments: ${error}`);
    return c.json({ error: "Failed to retrieve appointments" }, 500);
  }
});

// Prescription management endpoints

// Create or update prescription
app.post("/make-server-3066d3c4/prescriptions", async (c) => {
  try {
    const body = await c.req.json();
    const { patientId, doctorId, medications, instructions, duration, notes, feedbackId } = body;

    if (!patientId || !doctorId || !medications) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prescription = {
      id: crypto.randomUUID(),
      patientId,
      doctorId,
      medications: medications || [],
      instructions: instructions || '',
      duration: duration || '',
      notes: notes || '',
      feedbackId: feedbackId || null,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const prescriptionKey = `prescription:${prescription.id}`;
    await kv.set(prescriptionKey, prescription);

    // Add to patient's prescriptions
    const patientPrescriptionsKey = `patient_prescriptions:${patientId}`;
    const patientPrescriptions = await kv.get(patientPrescriptionsKey) || [];
    patientPrescriptions.push(prescription.id);
    await kv.set(patientPrescriptionsKey, patientPrescriptions);

    // Add to doctor's prescriptions
    const doctorPrescriptionsKey = `doctor_prescriptions:${doctorId}`;
    const doctorPrescriptions = await kv.get(doctorPrescriptionsKey) || [];
    doctorPrescriptions.push(prescription.id);
    await kv.set(doctorPrescriptionsKey, doctorPrescriptions);

    // Send notification to patient
    const patientInfo = await kv.get(`user:${patientId}`);
    const doctorInfo = await kv.get(`user:${doctorId}`);

    const patientNotification = {
      id: crypto.randomUUID(),
      userId: patientId,
      type: 'prescription_updated',
      priority: 'high',
      message: `New prescription from Dr. ${doctorInfo?.name || 'Doctor'}`,
      data: {
        prescriptionId: prescription.id,
        doctorId,
        doctorName: doctorInfo?.name,
        medicationCount: medications.length
      },
      timestamp: new Date().toISOString(),
      read: false
    };

    const patientNotificationKey = `notification:${patientNotification.id}`;
    await kv.set(patientNotificationKey, patientNotification);

    const patientNotificationsKey = `user_notifications:${patientId}`;
    const patientNotifications = await kv.get(patientNotificationsKey) || [];
    patientNotifications.push(patientNotification.id);
    await kv.set(patientNotificationsKey, patientNotifications);

    // If this is in response to feedback, update the feedback status
    if (feedbackId) {
      const feedbackKey = `feedback:${patientId}:${feedbackId}`;
      const feedback = await kv.get(feedbackKey);
      if (feedback) {
        feedback.status = 'reviewed';
        feedback.prescriptionId = prescription.id;
        feedback.reviewedAt = new Date().toISOString();
        feedback.reviewedBy = doctorId;
        await kv.set(feedbackKey, feedback);
      }
    }

    console.log(`Prescription created: ${prescription.id} for patient ${patientId} by doctor ${doctorId}`);
    return c.json({ success: true, prescriptionId: prescription.id });
  } catch (error) {
    console.log(`Error creating prescription: ${error}`);
    return c.json({ error: "Failed to create prescription" }, 500);
  }
});

// Get patient's prescriptions
app.get("/make-server-3066d3c4/patient/:patientId/prescriptions", async (c) => {
  try {
    const patientId = c.req.param("patientId");
    
    const patientPrescriptionsKey = `patient_prescriptions:${patientId}`;
    const prescriptionIds = await kv.get(patientPrescriptionsKey) || [];

    const prescriptions = [];
    for (const prescriptionId of prescriptionIds) {
      const prescriptionKey = `prescription:${prescriptionId}`;
      const prescription = await kv.get(prescriptionKey);
      if (prescription) {
        // Get doctor info
        const doctorKey = `user:${prescription.doctorId}`;
        const doctorInfo = await kv.get(doctorKey);
        prescription.doctorInfo = doctorInfo ? {
          name: doctorInfo.name,
          specialization: doctorInfo.specialization
        } : null;
        prescriptions.push(prescription);
      }
    }

    prescriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ prescriptions });
  } catch (error) {
    console.log(`Error getting patient prescriptions: ${error}`);
    return c.json({ error: "Failed to get prescriptions" }, 500);
  }
});

// Get doctor's prescriptions
app.get("/make-server-3066d3c4/doctor/:doctorId/prescriptions", async (c) => {
  try {
    const doctorId = c.req.param("doctorId");
    
    const doctorPrescriptionsKey = `doctor_prescriptions:${doctorId}`;
    const prescriptionIds = await kv.get(doctorPrescriptionsKey) || [];

    const prescriptions = [];
    for (const prescriptionId of prescriptionIds) {
      const prescriptionKey = `prescription:${prescriptionId}`;
      const prescription = await kv.get(prescriptionKey);
      if (prescription) {
        // Get patient info
        const patientKey = `user:${prescription.patientId}`;
        const patientInfo = await kv.get(patientKey);
        prescription.patientInfo = patientInfo ? {
          name: patientInfo.name,
          phone: patientInfo.phone,
          therapyPlan: patientInfo.therapyPlan
        } : null;
        prescriptions.push(prescription);
      }
    }

    prescriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ prescriptions });
  } catch (error) {
    console.log(`Error getting doctor prescriptions: ${error}`);
    return c.json({ error: "Failed to get prescriptions" }, 500);
  }
});

// Get all patients for a doctor (based on feedback and prescriptions)
app.get("/make-server-3066d3c4/doctor/:doctorId/patients", async (c) => {
  try {
    const doctorId = c.req.param("doctorId");
    
    // Get all patients from therapy requests and prescriptions
    const doctorRequestsKey = `doctor_therapy_requests:${doctorId}`;
    const doctorPrescriptionsKey = `doctor_prescriptions:${doctorId}`;
    
    const requestIds = await kv.get(doctorRequestsKey) || [];
    const prescriptionIds = await kv.get(doctorPrescriptionsKey) || [];
    
    const patientIds = new Set();

    // Get patients from therapy requests
    for (const requestId of requestIds) {
      const requestKey = `therapy_request:${requestId}`;
      const request = await kv.get(requestKey);
      if (request) {
        patientIds.add(request.patientId);
      }
    }

    // Get patients from prescriptions
    for (const prescriptionId of prescriptionIds) {
      const prescriptionKey = `prescription:${prescriptionId}`;
      const prescription = await kv.get(prescriptionKey);
      if (prescription) {
        patientIds.add(prescription.patientId);
      }
    }

    const patients = [];
    for (const patientId of patientIds) {
      const patientKey = `user:${patientId}`;
      const patientInfo = await kv.get(patientKey);
      if (patientInfo) {
        // Get recent feedback
        const userFeedbackKey = `user_feedback:${patientId}`;
        const feedbackIds = await kv.get(userFeedbackKey) || [];
        const recentFeedbackId = feedbackIds[feedbackIds.length - 1];
        let recentFeedback = null;
        if (recentFeedbackId) {
          const feedbackKey = `feedback:${patientId}:${recentFeedbackId}`;
          recentFeedback = await kv.get(feedbackKey);
        }

        patients.push({
          ...patientInfo,
          recentFeedback,
          totalFeedbacks: feedbackIds.length
        });
      }
    }

    patients.sort((a, b) => a.name.localeCompare(b.name));

    return c.json({ patients });
  } catch (error) {
    console.log(`Error getting doctor patients: ${error}`);
    return c.json({ error: "Failed to get patients" }, 500);
  }
});

// Get pending feedback for doctors
app.get("/make-server-3066d3c4/doctor/:doctorId/pending-feedback", async (c) => {
  try {
    const doctorId = c.req.param("doctorId");
    
    // Get all patients for this doctor
    const doctorRequestsKey = `doctor_therapy_requests:${doctorId}`;
    const requestIds = await kv.get(doctorRequestsKey) || [];
    
    const patientIds = new Set();
    for (const requestId of requestIds) {
      const requestKey = `therapy_request:${requestId}`;
      const request = await kv.get(requestKey);
      if (request) {
        patientIds.add(request.patientId);
      }
    }

    const pendingFeedback = [];
    for (const patientId of patientIds) {
      const userFeedbackKey = `user_feedback:${patientId}`;
      const feedbackIds = await kv.get(userFeedbackKey) || [];
      
      for (const feedbackId of feedbackIds) {
        const feedbackKey = `feedback:${patientId}:${feedbackId}`;
        const feedback = await kv.get(feedbackKey);
        if (feedback && feedback.status === 'pending_review') {
          // Get patient info
          const patientKey = `user:${patientId}`;
          const patientInfo = await kv.get(patientKey);
          feedback.patientInfo = patientInfo ? {
            name: patientInfo.name,
            phone: patientInfo.phone,
            therapyPlan: patientInfo.therapyPlan
          } : null;
          pendingFeedback.push(feedback);
        }
      }
    }

    pendingFeedback.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return c.json({ feedback: pendingFeedback });
  } catch (error) {
    console.log(`Error getting pending feedback: ${error}`);
    return c.json({ error: "Failed to get pending feedback" }, 500);
  }
});

// Send consultation notification
app.post("/make-server-3066d3c4/notifications", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, message, type, priority, fromUserId } = body;

    const notification = {
      id: crypto.randomUUID(),
      userId,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      fromUserId,
      timestamp: new Date().toISOString(),
      read: false
    };

    const notificationKey = `notification:${notification.id}`;
    await kv.set(notificationKey, notification);

    // Add to user's notifications
    const userNotificationsKey = `user_notifications:${userId}`;
    const userNotifications = await kv.get(userNotificationsKey) || [];
    userNotifications.push(notification.id);
    await kv.set(userNotificationsKey, userNotifications);

    console.log(`Notification sent to user ${userId}: ${message}`);
    return c.json({ success: true, notificationId: notification.id });
  } catch (error) {
    console.log(`Error sending notification: ${error}`);
    return c.json({ error: "Failed to send notification" }, 500);
  }
});

// Get user notifications
app.get("/make-server-3066d3c4/notifications/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    const userNotificationsKey = `user_notifications:${userId}`;
    const notificationIds = await kv.get(userNotificationsKey) || [];
    
    const notifications = [];
    for (const notificationId of notificationIds) {
      const notificationKey = `notification:${notificationId}`;
      const notification = await kv.get(notificationKey);
      if (notification) {
        notifications.push(notification);
      }
    }

    // Sort by timestamp descending
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return c.json({ notifications });
  } catch (error) {
    console.log(`Error retrieving notifications: ${error}`);
    return c.json({ error: "Failed to retrieve notifications" }, 500);
  }
});

Deno.serve(app.fetch);