import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page as PdfPage, pdfjs } from 'react-pdf';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

const FlipPage = React.forwardRef<HTMLDivElement, { pageNumber: number; scale: number }>(({ pageNumber, scale }, ref) => {
  return (
    <div ref={ref} className="bg-white shadow-lg overflow-hidden flex justify-center items-center">
      <PdfPage 
        pageNumber={pageNumber} 
        scale={scale} 
        renderTextLayer={true}
        renderAnnotationLayer={true}
        className="max-w-full"
        loading={
          <div className="flex items-center justify-center p-20 text-gray-400 min-h-[500px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mr-3"></div>
            Renderizando página {pageNumber}...
          </div>
        }
      />
    </div>
  );
});

export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const flipBookRef = useRef<any>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const playFlipSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noiseSource.start();
    } catch (e) {
      console.warn("Could not play flip sound", e);
    }
  };

  const onPage = (e: any) => {
    setPageNumber(e.data + 1);
    playFlipSound();
  };

  const previousPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };
  
  const nextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 3.0));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const resetZoom = () => setScale(1.0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') previousPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages]);

  return (
    <div className="flex flex-col h-full bg-[#0D0F14] rounded-2xl overflow-hidden shadow-2xl relative select-none">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-[#121620] border-b border-[#1C2230] z-10 gap-2">
        <div className="flex items-center gap-4">
          <div className="text-gray-300 text-sm font-semibold flex items-center gap-2">
            Página {pageNumber} de {numPages || '--'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={zoomOut} disabled={scale <= 0.5} className="p-1.5 rounded bg-[#1A2130] text-gray-300 hover:text-white hover:bg-[#222B3E] disabled:opacity-50 transition" title="Reduzir Zoom">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-gray-400 text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} disabled={scale >= 3.0} className="p-1.5 rounded bg-[#1A2130] text-gray-300 hover:text-white hover:bg-[#222B3E] disabled:opacity-50 transition" title="Aumentar Zoom">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={resetZoom} className="p-1.5 rounded bg-[#1A2130] text-gray-300 hover:text-white hover:bg-[#222B3E] transition ml-1" title="Resetar Zoom">
            <Minimize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Area */}
      <div 
        className="flex-1 overflow-auto bg-[#060709] custom-scrollbar flex justify-center items-center p-4 md:p-8"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div 
          className="relative shadow-2xl transition-transform duration-200"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-20 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mr-3"></div>
                Carregando E-book...
              </div>
            }
            error={
              <div className="p-10 text-rose-400 text-center">
                Erro ao carregar o e-book.
              </div>
            }
          >
            {numPages && (
              <HTMLFlipBook 
                width={450} 
                height={600} 
                size="stretch"
                minWidth={280}
                maxWidth={800}
                minHeight={400}
                maxHeight={1000}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                usePortrait={true}
                onFlip={onPage}
                ref={flipBookRef}
                className="html-book"
                style={{ margin: '0 auto' }}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <FlipPage key={`page_${index + 1}`} pageNumber={index + 1} scale={1} />
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        </div>
      </div>

      {/* Bottom Controls / Navigation */}
      <div className="p-4 bg-[#121620] border-t border-[#1C2230] flex items-center justify-center gap-4 z-10">
        <button
          onClick={previousPage}
          disabled={pageNumber <= 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A2130] hover:bg-[#222B3E] text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold border border-[#202738] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Página Anterior
        </button>
        
        <button
          onClick={nextPage}
          disabled={pageNumber >= (numPages || 1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-black disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition shadow"
        >
          Próxima Página
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .react-pdf__Page__canvas {
          margin: 0 auto;
        }
        .html-book {
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);
        }
        .stf__wrapper {
          background: #060709 !important;
        }
        .react-pdf__Page__textContent {
          user-select: none !important;
          pointer-events: none !important;
        }
      `}} />
    </div>
  );
}
