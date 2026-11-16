import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Loader2, ShieldCheck, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatDuration, type Certificate } from "@/lib/certificate-data";

const CertificateVerification = () => {
  const { certificateId = "" } = useParams();
  const decodedId = (() => {
    try {
      return decodeURIComponent(certificateId).trim();
    } catch {
      return "";
    }
  })();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadCertificate = async () => {
      setLoading(true);
      setError(null);
      if (!decodedId) {
        setError("This certificate link is invalid.");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("internship_certificates")
        .select("certificate_id, student_name, domain, college_name, internship_start_date, internship_end_date, issue_date, certificate_status")
        .eq("certificate_id", decodedId)
        .maybeSingle();

      if (!active) return;
      if (queryError) setError("We couldn't verify this certificate just now. Please try again.");
      else if (!data) setError("No certificate was found with this ID.");
      else setCertificate(data as Certificate);
      setLoading(false);
    };

    loadCertificate();
    return () => {
      active = false;
    };
  }, [decodedId]);

  const verified = certificate?.certificate_status.toLowerCase() === "verified";
  const canonical = `https://deplorixtechnologies.site/verify/${encodeURIComponent(decodedId)}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Seo
        title={`${decodedId || "Certificate"} Verification | DeploriX Technologies`}
        description="Verify the authenticity and internship details of a DeploriX Technologies certificate."
        canonical={canonical}
      />
      <Navbar />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-32 sm:px-6">
        <div className="w-full max-w-2xl rounded-[2rem] border border-border/70 bg-card p-7 shadow-[var(--shadow-elevated)] sm:p-10">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Verifying certificate…
            </div>
          ) : error ? (
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive">
                <XCircle size={30} />
              </span>
              <h1 className="mt-6 font-display text-3xl font-bold">Certificate not verified</h1>
              <p className="mt-3 text-muted-foreground">{error}</p>
              <Button asChild className="mt-7"><Link to="/">Return home</Link></Button>
            </div>
          ) : certificate ? (
            <>
              <div className="flex flex-col gap-5 border-b border-border/70 pb-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="pill-label"><ShieldCheck size={14} /> Certificate verification</span>
                  <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">{certificate.student_name}</h1>
                  <p className="mt-2 font-mono text-sm text-muted-foreground">{certificate.certificate_id}</p>
                </div>
                <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  <CheckCircle2 size={17} /> {certificate.certificate_status}
                </span>
              </div>

              <dl className="mt-7 grid gap-5 sm:grid-cols-2">
                <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Domain</dt><dd className="mt-1.5 font-semibold">{certificate.domain}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">College</dt><dd className="mt-1.5 font-semibold">{certificate.college_name}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Internship period</dt><dd className="mt-1.5 font-semibold">{formatDuration(certificate.internship_start_date, certificate.internship_end_date)}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Issue date</dt><dd className="mt-1.5 font-semibold">{formatDate(certificate.issue_date)}</dd></div>
              </dl>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CertificateVerification;
