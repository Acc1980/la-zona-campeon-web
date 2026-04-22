"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TikTokDemoContent() {
  const searchParams = useSearchParams();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [publishId, setPublishId] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("connected") === "1") {
      setConnected(true);
    }
    if (searchParams.get("error")) {
      setError(`Error: ${searchParams.get("error")} — ${searchParams.get("detail") || ""}`);
    }
    fetch("/api/tiktok/post").then((r) => r.json()).then((d) => {
      if (d.connected) setConnected(true);
    });
  }, [searchParams]);

  async function handlePost() {
    if (!videoUrl) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/tiktok/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });
      const data = await res.json();
      if (data.data?.publish_id) {
        setPublishId(data.data.publish_id);
        setResult(`✅ Video enviado — publish_id: ${data.data.publish_id}`);
      } else {
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      setError("Error al publicar");
    } finally {
      setLoading(false);
    }
  }

  async function checkStatus() {
    if (!publishId) return;
    const res = await fetch(`/api/tiktok/post?publish_id=${publishId}`);
    const data = await res.json();
    setStatusResult(JSON.stringify(data, null, 2));
  }

  return (
    <main className="min-h-screen bg-[#16171e] flex flex-col items-center justify-start py-16 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-white font-bold text-2xl mb-2">TikTok — Demo Integration</h1>
        <p className="text-[#888] text-sm mb-8">La Zona Campeón · Content Posting API</p>

        {/* Step 1: Connect */}
        <div className="bg-[#2c2f3a] border border-[#474a54] rounded-xl p-6 mb-4">
          <h2 className="text-[#e2bc8e] font-bold uppercase text-xs tracking-widest mb-3">
            Paso 1 — Login Kit (OAuth)
          </h2>
          {connected ? (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span>✅</span>
              <span>Cuenta TikTok conectada</span>
            </div>
          ) : (
            <a
              href="/api/tiktok/auth"
              className="inline-flex items-center gap-2 bg-[#e2bc8e] text-[#0a0a0a] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#d4a96a] transition-colors"
            >
              Conectar con TikTok
            </a>
          )}
        </div>

        {/* Step 2: Post video */}
        {connected && (
          <div className="bg-[#2c2f3a] border border-[#474a54] rounded-xl p-6 mb-4">
            <h2 className="text-[#e2bc8e] font-bold uppercase text-xs tracking-widest mb-3">
              Paso 2 — Content Posting API
            </h2>
            <label className="text-[#888] text-xs mb-1 block">URL del video (mp4 público)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://lazonacampeon.com/videos/test.mp4"
              className="w-full bg-[#16171e] border border-[#474a54] text-white text-sm rounded-lg px-4 py-2.5 mb-3 focus:outline-none focus:border-[#e2bc8e]"
            />
            <button
              onClick={handlePost}
              disabled={loading || !videoUrl}
              className="bg-[#e2bc8e] text-[#0a0a0a] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#d4a96a] transition-colors disabled:opacity-50"
            >
              {loading ? "Publicando..." : "Publicar video en TikTok"}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-[#1a2a1a] border border-green-800 rounded-xl p-4 mb-4">
            <pre className="text-green-400 text-xs whitespace-pre-wrap">{result}</pre>
            {publishId && (
              <button
                onClick={checkStatus}
                className="mt-3 text-xs text-[#e2bc8e] underline"
              >
                Verificar estado
              </button>
            )}
          </div>
        )}

        {statusResult && (
          <div className="bg-[#1a1a2a] border border-blue-800 rounded-xl p-4 mb-4">
            <pre className="text-blue-300 text-xs whitespace-pre-wrap">{statusResult}</pre>
          </div>
        )}

        {error && (
          <div className="bg-[#2a1a1a] border border-red-800 rounded-xl p-4 mb-4">
            <pre className="text-red-400 text-xs whitespace-pre-wrap">{error}</pre>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TikTokDemoPage() {
  return (
    <Suspense>
      <TikTokDemoContent />
    </Suspense>
  );
}
