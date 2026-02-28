import { NextRequest, NextResponse } from "next/server";

interface ApplicationPayload {
  name: string;
  email: string;
  whatBuilding: string;
  monthlyRevenue: string;
  timeline: string;
}

function isValidPayload(body: unknown): body is ApplicationPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" && b.name.trim().length > 0 &&
    typeof b.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.whatBuilding === "string" && b.whatBuilding.trim().length >= 20 &&
    typeof b.monthlyRevenue === "string" && b.monthlyRevenue.trim().length > 0 &&
    typeof b.timeline === "string" && b.timeline.trim().length > 0
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json(
        { error: "Invalid or incomplete application data." },
        { status: 400 }
      );
    }

    const { name, email, whatBuilding, monthlyRevenue, timeline } = body;

    // ─── Option A: Supabase ───────────────────────────────────────────────
    // Uncomment and configure to store applications in Supabase.
    //
    // import { createClient } from "@supabase/supabase-js";
    // const supabase = createClient(
    //   process.env.SUPABASE_URL!,
    //   process.env.SUPABASE_SERVICE_ROLE_KEY!
    // );
    // const { error: dbError } = await supabase
    //   .from("founder_launch_applications")
    //   .insert([{ name, email, what_building: whatBuilding, monthly_revenue: monthlyRevenue, timeline }]);
    // if (dbError) throw dbError;

    // ─── Option B: Formspree ──────────────────────────────────────────────
    // Uncomment and set FORMSPREE_ENDPOINT in your .env.local
    //
    // const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT!;
    // const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", Accept: "application/json" },
    //   body: JSON.stringify({ name, email, whatBuilding, monthlyRevenue, timeline }),
    // });
    // if (!formspreeRes.ok) throw new Error("Formspree submission failed");

    // ─── Option C: Email notification (e.g., Resend) ──────────────────────
    // Uncomment and install `resend` package: npm install resend
    //
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Founder Launch <noreply@founderlaunchweb.com>",
    //   to: ["hello@founderlaunchweb.com"],
    //   subject: `New Application: ${name}`,
    //   html: `<h2>New Founder Launch Application</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Building:</strong> ${whatBuilding}</p>
    //     <p><strong>Revenue:</strong> ${monthlyRevenue}</p>
    //     <p><strong>Timeline:</strong> ${timeline}</p>`,
    // });

    // Default: log for development (replace with real integration above)
    console.log("New Founder Launch Application:", {
      name,
      email,
      whatBuilding,
      monthlyRevenue,
      timeline,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Application received. We'll be in touch within 48 hours." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to process application. Please try again." },
      { status: 500 }
    );
  }
}
