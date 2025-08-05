# 🔐 Admin Setup Guide

## 🚨 **Why Your Dashboard is Blank**

The admin dashboard is blank because you created a user in Firebase Console, but that user doesn't have the `role: "admin"` field in Firestore. The application checks for this role to determine admin access.

## ✅ **Solution: Create Admin Through the App**

### **Step 1: Go to Admin Portal**

1. Navigate to: `http://localhost:3000/admin`
2. Click "Admin Login"
3. Click "Need an admin account? Sign up"

### **Step 2: Create Admin Account**

Fill in the form with:

- **Email**: `admin@yourhospital.com`
- **Password**: `securepassword123`
- **Display Name**: `Dr. Admin`

### **Step 3: Access Dashboard**

After creating the account, you'll be automatically redirected to `/admin/dashboard`

## 🔧 **Alternative: Fix Existing Firebase User**

If you want to use the user you created in Firebase Console:

### **Method 1: Browser Console**

1. Log in with your Firebase user at `/admin/login`
2. Open browser console (F12)
3. Copy and paste this code:

```javascript
// Make current user admin
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const makeCurrentUserAdmin = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      return;
    }

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Admin User",
      role: "admin",
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    console.log("✅ User successfully made admin!");
    window.location.reload();
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

makeCurrentUserAdmin();
```

### **Method 2: Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `my-medical-ba9bc`
3. Go to **Firestore Database**
4. Create a new document in the `users` collection
5. Document ID: `[your-user-uid]` (get this from Authentication section)
6. Add these fields:
   ```json
   {
     "uid": "[your-user-uid]",
     "email": "[your-email]",
     "displayName": "Admin User",
     "role": "admin",
     "createdAt": "2024-01-01T00:00:00.000Z",
     "isActive": true
   }
   ```

## 🧪 **Test the Setup**

### **Check Admin Status**

1. Go to `/admin`
2. You should see "Welcome, [Your Name]!" if you're logged in as admin
3. Click "Go to Admin Dashboard"

### **Test Dashboard**

1. Go to `/admin/dashboard`
2. You should see the admin interface
3. If no appointments exist, you'll see "No appointments found"

### **Create Test Appointment**

1. Go to `/appointments`
2. Book a test appointment
3. Go back to `/admin/dashboard`
4. You should now see the appointment in the list

## 🔍 **Debug Information**

### **Check Console Logs**

Open browser console (F12) and look for:

- `Admin Dashboard Debug: { currentUser: ..., userRole: ... }`
- `User is admin, loading dashboard...`

### **Common Issues**

1. **"User is not admin, redirecting..."**

   - Solution: Create admin account through the app or fix existing user

2. **"No user logged in, redirecting..."**

   - Solution: Log in first at `/admin/login`

3. **"Failed to load appointments"**
   - Solution: Check Firebase Console → Firestore Database is created
   - Check browser console for specific error messages

## 📊 **Expected Data Structure**

### **Users Collection**

```json
{
  "uid": "user_id_from_firebase_auth",
  "email": "admin@hospital.com",
  "displayName": "Dr. Admin",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

### **Appointments Collection**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "date": "2024-01-15",
  "time": "10:00",
  "service": "general",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 **Quick Fix Summary**

1. **Best Option**: Create admin through `/admin` → "Admin Login" → "Sign up"
2. **Alternative**: Fix existing user with browser console script
3. **Manual**: Add user document in Firebase Console Firestore

The admin dashboard should work perfectly after following these steps! 🚀
