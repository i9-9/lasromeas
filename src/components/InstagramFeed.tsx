import Image from "next/image";

const INSTAGRAM_URL = "https://instagram.com/lasromeas";
const HANDLE = "@lasromeas";

interface InstagramPost {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
}

async function fetchInstagramPosts(): Promise<InstagramPost[] | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption&limit=9&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.data as InstagramPost[]).filter(
      (p) => p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM" || p.thumbnail_url
    );
  } catch {
    return null;
  }
}

export default async function InstagramFeed() {
  const posts = await fetchInstagramPosts();

  return (
    <section className="py-16 px-8 md:px-8 bg-ink/5 border-y border-ink/10">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <p className="label-section">Instagram</p>
          <div className="divider-gold" />
          <h2 className="title-section">Seguinos en Instagram</h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-ink/50 text-sm tracking-[0.15em] hover:text-gold transition-colors duration-300"
          >
            {HANDLE}
          </a>
        </div>

        {posts && posts.length > 0 ? (
          /* Grid de posts */
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {posts.slice(0, 9).map((post) => {
              const imgSrc =
                post.media_type === "VIDEO"
                  ? (post.thumbnail_url ?? "")
                  : post.media_url;
              if (!imgSrc) return null;
              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden bg-ink/10"
                >
                  <Image
                    src={imgSrc}
                    alt={post.caption?.slice(0, 60) ?? "Instagram post"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  <div
                    className="absolute inset-0 bg-ink/0 group-hover:bg-ink/35
                                transition-all duration-300 flex items-center justify-center"
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          /* Fallback cuando no hay token */
          <div className="relative overflow-hidden border border-ink/15 p-12 flex flex-col items-center text-center gap-6">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background:
                  "radial-gradient(ellipse at center, #C9A96E 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 space-y-5">
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9A96E"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="#C9A96E" stroke="none" />
              </svg>
              <p className="text-ink/60 text-sm tracking-[0.05em] leading-relaxed max-w-md">
                Seguí nuestro proceso, los orígenes del cacao y las últimas
                novedades.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                Ver Instagram
              </a>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/40 text-xs tracking-[0.2em] uppercase hover:text-gold transition-colors duration-300"
          >
            Ver más en Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
