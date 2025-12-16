"use client";

import { useRouter } from "next/navigation";
import { FaFolder, FaFileAlt, FaExternalLinkAlt } from "react-icons/fa";

interface FileItem {
  name: string;
  type: "folder" | "file" | "link";
  description?: string;
  path?: string;
}

const files: FileItem[] = [
  {
    name: "Portfolio.site",
    type: "link",
    description: "Open main portfolio page",
    path: "/portfolio",
  },
  {
    name: "Resume.pdf",
    type: "file",
    description: "Download resume (placeholder)",
    path: "mailto:mohit.jangid2805@gmail.com?subject=Resume%20Request",
  },
  {
    name: "About.txt",
    type: "file",
    description: "Scroll to About section on portfolio",
    path: "/portfolio#about",
  },
  {
    name: "Projects",
    type: "folder",
    description: "Scroll to Projects section on portfolio",
    path: "/portfolio#projects",
  },
];

export default function FileExplorer() {
  const router = useRouter();

  const handleOpen = (item: FileItem) => {
    if (!item.path) return;

    if (item.path.startsWith("mailto:")) {
      window.location.href = item.path;
      return;
    }

    if (item.path.startsWith("/")) {
      router.push(item.path);
      return;
    }
  };

  return (
    <div className="w-full h-full bg-white/5 backdrop-blur-md text-white flex flex-col">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs uppercase tracking-wide">
        <span className="opacity-80">FINDER — PORTFOLIO</span>
        <span className="opacity-60">Macintosh HD ▸ Portfolio</span>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-40 border-r border-white/10 px-3 py-3 text-xs space-y-2 bg-white/5">
          <div className="font-semibold opacity-80 mb-1">Favourites</div>
          <div className="space-y-1">
            <div className="opacity-80">Portfolio</div>
            <div className="opacity-60">Documents</div>
            <div className="opacity-60">Downloads</div>
          </div>
          <div className="font-semibold opacity-80 mt-4 mb-1">Locations</div>
          <div className="space-y-1 opacity-60">
            <div>Macintosh HD</div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleOpen(item)}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/40 transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/15 border border-white/30 shadow-md">
                  {item.type === "folder" && <FaFolder className="text-yellow-300" />}
                  {item.type === "file" && <FaFileAlt className="text-sky-200" />}
                  {item.type === "link" && <FaExternalLinkAlt className="text-emerald-200" />}
                </div>
                <div className="text-xs text-center">
                  <div className="font-semibold truncate max-w-[120px]">{item.name}</div>
                  {item.description && (
                    <div className="text-[10px] opacity-70 mt-1 line-clamp-2 max-w-[140px]">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


