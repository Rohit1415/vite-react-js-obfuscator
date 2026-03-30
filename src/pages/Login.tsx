import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string }, { setSubmitting }: any) => {
    setError(null);
    try {
      const res = await api.login(values);
      // Assume token is in res.token and user is in res.user. 
      // If the backend only returns message, we mock a token.
      const token = res.token || "mock_jwt_token_" + Date.now();
      const user = res.user || { id: "user-1", email: values.email };
      
      login(token, user);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 animate-fade-in relative z-10 w-full min-h-[70vh]">
      <div className="card-premium w-full max-w-lg p-8 sm:p-12 space-y-10 relative overflow-hidden backdrop-blur-2xl">
        {/* Abstract Glow Effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"></div>

        <div className="text-center relative z-10 space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-2">
            <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Access Account</h2>
          <p className="text-gray-500 font-medium">Verify your identity to proceed securely.</p>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm text-red-600 text-sm font-semibold p-4 rounded-xl text-center shadow-sm border border-red-100/50 relative z-10 animate-fade-in">
            {error}
          </div>
        )}

        <Formik
          initialValues={{ email: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1 block">
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="test@test.com"
                  className="input-modern"
                  autoComplete="email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs font-bold ml-1 mt-1.5" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full group py-4 text-base"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating Handshake...</span>
                  </span>
                ) : (
                  "Secure Sign In"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm font-medium text-gray-400 relative z-10 pt-4 border-t border-gray-100/50">
          Hypestore uses advanced encryption to protect your data.
        </p>
      </div>
    </div>
  );
};

export default Login;
