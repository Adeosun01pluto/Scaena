// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Container from "../components/UI/Container.jsx";
// import { useStore } from "../context/Store.jsx";

// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { app } from "../lib/firebase";

// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();

// export default function Login() {
//   const { toggleLogin } = useStore();
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const redirect = params.get("redirect") || "/";   // 👈 DEFAULT ROUTE NOW "/"

//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [user, setUser] = useState(null);

//   // Watch Firebase auth state
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       if (u) {
//         setUser(u);
//         toggleLogin(true);

//         if (isLogin) {
//           // ONLY redirect after login, not after registration
//           navigate(redirect, { replace: true });
//         }
//       } else {
//         setUser(null);
//         toggleLogin(false);
//       }
//     });
//     return unsub;
//   }, [navigate, redirect, toggleLogin, isLogin]);

//   // Handle Login/Register
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         // REGISTER FLOW
//         await createUserWithEmailAndPassword(auth, email, password);

//         // Switch to login tab
//         setIsLogin(true);

//         // Clear form
//         setEmail("");
//         setPassword("");

//         setLoading(false);
//         return;
//       }

//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   // Google login
//   const handleGoogle = async () => {
//     setLoading(true);
//     try {
//       await signInWithPopup(auth, googleProvider);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="py-16">
//       <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow ring-1 ring-stone-200">
        
//         {/* Tabs */}
//         <div className="mb-6 flex justify-center space-x-4 border-b border-stone-200 pb-3">
//           <button
//             onClick={() => setIsLogin(true)}
//             className={`px-4 py-1 text-sm font-medium ${
//               isLogin
//                 ? "text-stone-900 border-b-2 border-stone-900"
//                 : "text-stone-500"
//             }`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setIsLogin(false)}
//             className={`px-4 py-1 text-sm font-medium ${
//               !isLogin
//                 ? "text-stone-900 border-b-2 border-stone-900"
//                 : "text-stone-500"
//             }`}
//           >
//             Register
//           </button>
//         </div>

//         <h1 className="text-xl font-semibold">
//           {isLogin ? "Sign in to your account" : "Create a new account"}
//         </h1>
//         <p className="mt-1 text-sm text-stone-600">
//           {isLogin
//             ? "Enter your credentials below to continue."
//             : "Fill out the form below to create a new account."}
//         </p>

//         <form onSubmit={handleLogin} className="mt-6 space-y-3">
//           <input
//             className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-700"
//             placeholder="Email"
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-700"
//             placeholder="Password"
//             type="password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {error && (
//             <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-2 w-full rounded-lg bg-stone-900 px-4 py-2 text-white hover:bg-stone-800 disabled:opacity-70"
//           >
//             {loading
//               ? isLogin
//                 ? "Signing in..."
//                 : "Creating account..."
//               : isLogin
//               ? "Sign In"
//               : "Register"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="my-6 flex items-center gap-3">
//           <div className="h-px flex-1 bg-stone-200" />
//           <span className="text-xs text-stone-500">or</span>
//           <div className="h-px flex-1 bg-stone-200" />
//         </div>

//         {/* Google login */}
//         <button
//           onClick={handleGoogle}
//           disabled={loading}
//           className="flex w-full items-center justify-center gap-3 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-100 disabled:opacity-70"
//         >
//           <img
//             src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//             alt="Google"
//             className="h-5 w-5"
//           />
//           Continue with Google
//         </button>

//         {user && (
//           <p className="mt-6 text-center text-sm text-green-700">
//             Logged in as <strong>{user.email}</strong>
//           </p>
//         )}
//       </div>
//     </Container>
//   );
// }


























import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../components/UI/Container.jsx";
import { useStore } from "../context/Store.jsx";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../lib/firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const { toggleLogin } = useStore();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // Default redirect is home "/"
  const redirect = params.get("redirect") || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Watch Firebase auth state only to sync UI/global store
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        toggleLogin(true);
      } else {
        setUser(null);
        toggleLogin(false);
      }
    });

    return unsub;
  }, [toggleLogin]);

  // Handle Login/Register
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // LOGIN FLOW
        await signInWithEmailAndPassword(auth, email, password);

        // ✅ redirect to home (or ?redirect=...)
        navigate(redirect, { replace: true });
      } else {
        // REGISTER FLOW
        await createUserWithEmailAndPassword(auth, email, password);

        // Switch to login tab after successful registration
        setIsLogin(true);

        // Clear form
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);

      // ✅ redirect to home (or ?redirect=...)
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow ring-1 ring-stone-200">
        {/* Tabs */}
        <div className="mb-6 flex justify-center space-x-4 border-b border-stone-200 pb-3">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-1 text-sm font-medium ${
              isLogin
                ? "text-stone-900 border-b-2 border-stone-900"
                : "text-stone-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-1 text-sm font-medium ${
              !isLogin
                ? "text-stone-900 border-b-2 border-stone-900"
                : "text-stone-500"
            }`}
          >
            Register
          </button>
        </div>

        <h1 className="text-xl font-semibold">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          {isLogin
            ? "Enter your credentials below to continue."
            : "Fill out the form below to create a new account."}
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-700"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-700"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-stone-900 px-4 py-2 text-white hover:bg-stone-800 disabled:opacity-70"
          >
            {loading
              ? isLogin
                ? "Signing in..."
                : "Creating account..."
              : isLogin
              ? "Sign In"
              : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-xs text-stone-500">or</span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        {/* Google login */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-100 disabled:opacity-70"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        {user && (
          <p className="mt-6 text-center text-sm text-green-700">
            Logged in as <strong>{user.email}</strong>
          </p>
        )}
      </div>
    </Container>
  );
}
