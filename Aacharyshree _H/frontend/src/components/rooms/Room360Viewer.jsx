import { useRef } from "react";

import {
  ReactPhotoSphereViewer,
} from "react-photo-sphere-viewer";

import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCcw,
} from "lucide-react";

export default function Room360Viewer({ image }) {
  const viewerRef = useRef(null);

  const rotateLeft = () => {
    if (!viewerRef.current) return;

    const pos = viewerRef.current.getPosition();

    viewerRef.current.animate({
      yaw: pos.yaw - Math.PI / 8,
      pitch: pos.pitch,
      speed: "2rpm",
    });
  };

  const rotateRight = () => {
    if (!viewerRef.current) return;

    const pos = viewerRef.current.getPosition();

    viewerRef.current.animate({
      yaw: pos.yaw + Math.PI / 8,
      pitch: pos.pitch,
      speed: "2rpm",
    });
  };

  const zoomIn = () => {
    if (!viewerRef.current) return;

    viewerRef.current.zoomIn(15);
  };

  const zoomOut = () => {
    if (!viewerRef.current) return;

    viewerRef.current.zoomOut(15);
  };

  const resetView = () => {
    if (!viewerRef.current) return;

    viewerRef.current.animate({
      yaw: 0,
      pitch: 0,
      zoom: 50,
      speed: "8rpm",
    });
  };

  const fullscreen = () => {
    if (!viewerRef.current) return;

    viewerRef.current.toggleFullscreen();
  };

  return (
    <div className="space-y-6">

      <div className="overflow-hidden rounded-3xl shadow-2xl">

        <ReactPhotoSphereViewer
          ref={viewerRef}
          src={image}
          width="100%"
          height="520px"
          defaultZoomLvl={45}
          navbar={false}
        />

      </div>

      {/* Controls */}

      <div className="flex flex-wrap justify-center gap-4">

        <button
          onClick={rotateLeft}
          className="rounded-xl bg-[#184A73] p-3 text-white transition hover:bg-[#103754]"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={rotateRight}
          className="rounded-xl bg-[#184A73] p-3 text-white transition hover:bg-[#103754]"
        >
          <RotateCw size={20} />
        </button>

        <button
          onClick={zoomIn}
          className="rounded-xl bg-[#184A73] p-3 text-white transition hover:bg-[#103754]"
        >
          <ZoomIn size={20} />
        </button>

        <button
          onClick={zoomOut}
          className="rounded-xl bg-[#184A73] p-3 text-white transition hover:bg-[#103754]"
        >
          <ZoomOut size={20} />
        </button>

        <button
          onClick={resetView}
          className="rounded-xl bg-[#184A73] p-3 text-white transition hover:bg-[#103754]"
        >
          <RefreshCcw size={20} />
        </button>

        <button
          onClick={fullscreen}
          className="rounded-xl bg-[#184A73] p-3 text-white transition hover:bg-[#103754]"
        >
          <Maximize2 size={20} />
        </button>

      </div>

      <p className="text-center text-sm text-slate-500">
        Drag with your mouse (or finger on mobile) to explore the room.
      </p>

    </div>
  );
}