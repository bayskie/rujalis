import L, { type Pattern } from "leaflet";
import { type LucideIcon } from "lucide-react";
import ReactDOMServer from "react-dom/server";

export function createLinePattern(
  pattern: string,
  color: string,
  weight: number,
): Pattern[] {
  if (pattern === "solid") return [];

  const patterns: Pattern[] = [];
  const repeat = 10;
  let pixelSize = 10;

  switch (pattern) {
    case "dotted":
      pixelSize = 0;
      break;
    case "dashed":
    case "dashed-dotted":
      pixelSize = 5;
      break;
  }

  patterns.push({
    offset: 0,
    repeat,
    symbol: L.Symbol.dash({
      pixelSize,
      pathOptions: { color, weight },
    }),
  });

  if (pattern === "dashed-dotted") {
    patterns.push({
      offset: 5,
      repeat,
      symbol: L.Symbol.dash({
        pixelSize: 0,
        pathOptions: { color, weight },
      }),
    });
  }

  return patterns;
}

export function createIconPattern(icon: LucideIcon, color: string): Pattern[] {
  if (!icon) return [];

  const Icon = icon;

  const html = ReactDOMServer.renderToString(
    <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full border bg-white">
      <Icon color={color} size={12} />
    </div>,
  );

  return [
    {
      offset: "50%",
      repeat: 0,
      symbol: L.Symbol.marker({
        markerOptions: {
          interactive: false,
          icon: L.divIcon({
            className: "",
            html,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        },
      }),
    },
  ];
}
