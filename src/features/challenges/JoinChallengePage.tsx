import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Swords, Key, ArrowRight } from "lucide-react";
import { useJoinChallengeMutation } from "../../services/challengeApi";
import { Button } from "../../components/ui/Button";
import { parseError } from "../../utils/errorParser";

/**
 * Public landing page for private challenge invite links.
 * URL: /join?code=A3F9E201
 *
 * - If user is authenticated: auto-submits the join code
 * - If not authenticated: shows the code + redirects to /login,
 *   then returns here after login via `?redirect=/join?code=...`
 */
export default function JoinChallengePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code")?.toUpperCase() ?? "";

  const [joinChallenge, { isLoading }] = useJoinChallengeMutation();
  const [attempted, setAttempted] = useState(false);

  // Auto-join on mount if code is present
  useEffect(() => {
    if (!code || attempted) return;
    setAttempted(true);

    const doJoin = async () => {
      try {
        const result = await joinChallenge({
          id: "placeholder",
          joinCode: code,
        }).unwrap();
        toast.success(result.message ?? "Joined challenge!");
        navigate("/app/challenges", { replace: true });
      } catch (err: any) {
        const status = err?.status ?? err?.data?.status;
        if (status === 401 || status === 403) {
          // Not logged in — send to login, return here after
          navigate(
            `/login?redirect=${encodeURIComponent(`/join?code=${code}`)}`,
            { replace: true },
          );
        } else if (status === 409) {
          toast("You've already joined this challenge!");
          navigate("/app/challenges", { replace: true });
        } else {
          toast.error(parseError(err));
        }
      }
    };

    doJoin();
  }, [code, attempted, joinChallenge, navigate]);

  // Fallback UI while auto-joining or if no code
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-5">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-brand-600/20 border border-brand-600/30">
            <Swords size={28} className="text-brand-400" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">Challenge Invite</h1>
          {code ? (
            <p className="text-sm text-gray-400 mt-1">
              Joining with code{" "}
              <span className="font-mono font-bold text-white tracking-widest">
                {code}
              </span>
              …
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">
              No join code found in this link.
            </p>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Joining challenge…
          </div>
        )}

        {!code && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Ask the challenge creator to share their invite link or
              8-character code.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate("/app/challenges")}
            >
              <Key size={15} />
              Enter Code Manually
              <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
