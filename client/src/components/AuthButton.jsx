import { LogIn, LogOut, User, Loader2 } from "lucide-react";
import { isFirebaseConfigured } from "../firebase";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

/**
 * AuthButton
 * Shows "Sign in to save" or signed-in state depending on auth status.
 * Renders nothing when Firebase is not configured.
 * Styling matches the LALens warm-cream / purple design language.
 */
function AuthButton({ className = "" }) {
  const { currentUser, loading, signInWithGoogle, signOutUser } = useFirebaseAuth();

  if (!isFirebaseConfigured) return null;

  if (loading) {
    return (
      <span className={`auth-btn auth-btn--loading ${className}`.trim()}>
        <Loader2 size={14} className="spin" aria-hidden />
        <span>Checking…</span>
      </span>
    );
  }

  if (currentUser) {
    const display = currentUser.displayName?.split(" ")[0] || currentUser.email;
    return (
      <div className={`auth-btn-group ${className}`.trim()}>
        <span className="auth-btn-user">
          <User size={13} aria-hidden />
          {display}
        </span>
        <button
          type="button"
          className="auth-btn auth-btn--signout"
          onClick={signOutUser}
          aria-label="Sign out of LALens"
        >
          <LogOut size={13} aria-hidden />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`auth-btn auth-btn--signin ${className}`.trim()}
      onClick={signInWithGoogle}
    >
      <LogIn size={14} aria-hidden />
      Sign in to save
    </button>
  );
}

export default AuthButton;
