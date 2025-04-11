import { useState } from "react";
import SignupForm from "@/features/auth/SignupForm";
import LoginForm from "@/features/auth/LoginForm";

export default function AuthLanding({ onAuth, onGuest }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {mode === "login" ? "Log In" : "Sign Up"}
        </h2>
  
        {mode === "login" ? (
          <LoginForm onLogin={onAuth} />
        ) : (
          <SignupForm onSignup={onAuth} />
        )}
  
        <p className="text-center text-sm mt-4">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button onClick={() => setMode("signup")} className="underline text-blue-600">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="underline text-blue-600">
                Log in
              </button>
            </>
          )}
        </p>
  
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mb-2">Or</p>
          <button onClick={onGuest} className="text-blue-600 underline text-sm">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
