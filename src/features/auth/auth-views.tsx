"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { DemoNote } from "@/components/ui/feedback";
import { Field, Input } from "@/components/ui/fields";
import { useToast } from "@/components/ui/toast";
import { demoProfiles } from "@/components/layout/navigation";
import { useStore } from "@/lib/mock-store";
import { homeForRole, routes } from "@/lib/routes";
import { isEmail, isRequired, hasMinLength, type FieldErrors } from "@/lib/validators";

function AuthCard({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <p className="font-serif text-3xl text-teal">Larkwell</p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{body}</p>
      <DemoNote>Demo sign-in only. Any listed email works with a password of six or more characters. No account is created.</DemoNote>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function SignInView() {
  const { actions } = useStore();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("maya.ellison@larkwell.demo");
  const [password, setPassword] = useState("larkwell");
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = () => {
    const next: FieldErrors = {};
    if (!isEmail(email)) next.email = "Enter an email address.";
    if (!hasMinLength(password, 6)) next.password = "Use at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const profile = demoProfiles.find((item) => item.userId && email.toLowerCase().includes(item.label.split(" ")[0].toLowerCase()));
    const match =
      email.includes("helen") ? demoProfiles[3] :
      email.includes("irene") ? demoProfiles[6] :
      email.includes("owen") ? demoProfiles[2] :
      profile?.role === "student" || profile?.role === "teacher" || profile?.role === "admin" ? profile : demoProfiles[1];
    actions.signIn(match.role, match.userId);
    toast({ title: `Welcome, ${match.label.split(" ")[0]}`, description: "This preview stays in your browser.", tone: "success" });
    router.push(homeForRole(match.role));
  };

  return (
    <AuthCard title="Sign in" body="Choose a studio profile, or continue with Maya.">
      <div className="grid gap-3">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        </Field>
        <Button onClick={submit}>Enter the studio</Button>
        <div className="flex justify-between text-sm">
          <Link href={routes.forgot} className="text-teal">Forgot password</Link>
          <Link href={routes.signUp} className="text-teal">Create a demo profile</Link>
        </div>
      </div>
    </AuthCard>
  );
}

export function SignUpView() {
  const { state, actions } = useStore();
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = () => {
    const next: FieldErrors = {};
    if (!isRequired(name)) next.name = "Add your name.";
    if (!isEmail(email)) next.email = "Enter an email address.";
    if (!hasMinLength(password, 6)) next.password = "Use at least 6 characters.";
    if (!state.settings.signupsOpen) next.form = "Signups are paused in the studio settings.";
    setErrors(next);
    if (Object.keys(next).length) return;
    toast({ title: "Profile started", description: "Passwords are not stored. Continue onboarding.", tone: "success" });
    const userId = role === "teacher" ? "teacher-helen-01" : "student-maya-01";
    actions.signIn(role, userId);
    if (role === "student") actions.updateStudent(userId, { name, email });
    else actions.updateTeacher(userId, { name, email });
    router.push(`${routes.onboarding}?role=${role}`);
  };

  return (
    <AuthCard title="Join the studio" body="Tell us whether you are here to learn or to teach. The next screen is a short onboarding.">
      <div className="grid gap-3">
        {errors.form ? <p className="text-sm text-danger">{errors.form}</p> : null}
        <Field label="Name" htmlFor="name" error={errors.name}><Input id="name" value={name} onChange={(event) => setName(event.target.value)} /></Field>
        <Field label="Email" htmlFor="signup-email" error={errors.email}><Input id="signup-email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
        <Field label="I am here to" htmlFor="role">
          <select id="role" className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" value={role} onChange={(event) => setRole(event.target.value as "student" | "teacher")}>
            <option value="student">Learn</option>
            <option value="teacher">Teach</option>
          </select>
        </Field>
        <Field label="Password" htmlFor="signup-password" error={errors.password} hint="Used only to rehearse the form.">
          <Input id="signup-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        <Button onClick={submit}>Continue</Button>
        <Link href={routes.signIn} className="text-sm text-teal">I already have a demo profile</Link>
      </div>
    </AuthCard>
  );
}

export function ForgotView() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  return (
    <AuthCard title="Forgot password" body="In a live studio this would send a note. Here it opens the reset screen.">
      {sent ? (
        <div className="grid gap-3">
          <p className="text-sm leading-6 text-ink-soft">If this were live, a reset note would go to {email}. In this demo, continue to choose a new password. It will not be saved.</p>
          <LinkButton href={`${routes.reset}?email=${encodeURIComponent(email)}`}>Continue to reset</LinkButton>
        </div>
      ) : (
        <div className="grid gap-3">
          <Field label="Email" htmlFor="forgot-email" error={error}>
            <Input id="forgot-email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Button onClick={() => (isEmail(email) ? setSent(true) : setError("Enter an email address."))}>Send reset note</Button>
        </div>
      )}
    </AuthCard>
  );
}

export function ResetView() {
  const params = useParams();
  void params;
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  return (
    <AuthCard title="Choose a new password" body="The new password is checked and then discarded. This demo does not keep credentials.">
      <div className="grid gap-3">
        <Field label="New password" htmlFor="new-password" error={error}>
          <Input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        <Field label="Confirm" htmlFor="confirm-password">
          <Input id="confirm-password" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
        </Field>
        <Button
          onClick={() => {
            if (!hasMinLength(password, 6)) return setError("Use at least 6 characters.");
            if (password !== confirm) return setError("The two passwords do not match.");
            toast({ title: "Password updated in the rehearsal", description: "Nothing was stored.", tone: "success" });
            router.push(routes.signIn);
          }}
        >
          Save and return
        </Button>
      </div>
    </AuthCard>
  );
}

export function OnboardingView() {
  const { state, actions } = useStore();
  const router = useRouter();
  const toast = useToast();
  const role = state.session.role === "teacher" ? "teacher" : "student";
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [interest, setInterest] = useState("Mathematics");
  const subjects = ["Mathematics", "Physics", "Languages", "Writing", "Computing"];

  const finish = () => {
    if (role === "student" && state.session.userId) {
      actions.updateStudent(state.session.userId, { learningGoals: goal || "Learn steadily.", interests: [interest] });
    }
    if (role === "teacher" && state.session.userId) {
      actions.updateTeacher(state.session.userId, { subjects: [interest], teachingStyle: goal || "Slow board work." });
    }
    toast({ title: "You are ready", description: "Preferences were saved in this browser.", tone: "success" });
    router.push(homeForRole(role));
  };

  return (
    <AuthCard title={step === 0 ? "What are you here for?" : "How should the studio feel?"} body="Two short questions. You can change them later in settings.">
      {step === 0 ? (
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            {subjects.map((item) => (
              <button key={item} type="button" onClick={() => setInterest(item)} className={`rounded-full px-3 py-1.5 text-sm ${interest === item ? "bg-teal text-paper" : "bg-paper-deep text-ink"}`}>
                {item}
              </button>
            ))}
          </div>
          <Button onClick={() => setStep(1)}>Next</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          <Field label={role === "teacher" ? "A sentence about your teaching" : "A learning aim"} htmlFor="goal">
            <Input id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} />
          </Field>
          <Button onClick={finish}>Enter the studio</Button>
        </div>
      )}
    </AuthCard>
  );
}
