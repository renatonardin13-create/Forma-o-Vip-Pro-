import React, { useState, useEffect, useRef } from 'react';
import { Document, Page as PdfPage, pdfjs } from 'react-pdf';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Minimize } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

const FlipPage = React.forwardRef<HTMLDivElement, { pageNumber: number }>(({ pageNumber }, ref) => {
  return (
    <div ref={ref} className="bg-white overflow-hidden flex justify-center items-center w-full h-full shadow-lg">
      <PdfPage 
        pageNumber={pageNumber} 
        scale={2.0} // High resolution render
        renderTextLayer={true}
        renderAnnotationLayer={true}
        className="pdf-page-wrapper flex justify-center items-center w-full h-full"
        loading={
          <div className="flex items-center justify-center text-gray-400 min-h-full w-full bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mr-3"></div>
            <span className="text-xs">Carregando...</span>
          </div>
        }
      />
    </div>
  );
});

export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1.0);
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

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2.5));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
  const resetZoom = () => setZoom(1.0);

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
    <div className="flex flex-col h-full w-full bg-[#0D0F14] rounded-2xl overflow-hidden shadow-2xl relative select-none">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-[#121620] border-b border-[#1C2230] z-20 gap-2 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-gray-300 text-sm font-semibold flex items-center gap-2">
            Página {pageNumber} de {numPages || '--'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={zoomOut} disabled={zoom <= 0.5} className="p-1.5 rounded bg-[#1A2130] text-gray-300 hover:text-white hover:bg-[#222B3E] disabled:opacity-50 transition" title="Reduzir Zoom">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-gray-400 text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} disabled={zoom >= 2.5} className="p-1.5 rounded bg-[#1A2130] text-gray-300 hover:text-white hover:bg-[#222B3E] disabled:opacity-50 transition" title="Aumentar Zoom">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={resetZoom} className="p-1.5 rounded bg-[#1A2130] text-gray-300 hover:text-white hover:bg-[#222B3E] transition ml-1" title="Resetar Zoom">
            <Minimize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Area - Using Flex and Object Fit approach */}
      <div 
        className="flex-1 overflow-auto bg-[#060709] custom-scrollbar flex justify-center items-center relative"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div 
          className="relative transition-all duration-200 flex justify-center items-center"
          style={{ 
            width: `${100 * zoom}%`, 
            height: `${100 * zoom}%`, 
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="w-full h-full flex justify-center items-center p-4 md:p-8"
            loading={
              <div className="flex flex-col items-center justify-center p-20 text-[#D4AF37]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37] mb-4"></div>
                <span className="font-medium tracking-wider text-sm uppercase">Carregando E-book...</span>
              </div>
            }
            error={
              <div className="p-10 text-rose-400 text-center font-medium bg-rose-500/10 rounded-xl border border-rose-500/20">
                Erro ao carregar o e-book protegido.
              </div>
            }
          >
            {numPages && (
              <HTMLFlipBook 
                width={400} 
                height={560} 
                size="stretch"
                minWidth={200}
                maxWidth={1000}
                minHeight={280}
                maxHeight={1400}
                maxShadowOpacity={0.4}
                showCover={true}
                mobileScrollSupport={true}
                usePortrait={true}
                onFlip={onPage}
                ref={flipBookRef}
                className="html-book"
                style={{ margin: '0 auto' }}
                flippingTime={600}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <FlipPage 
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                  />
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        </div>
      </div>

      {/* Bottom Controls / Navigation */}
      <div className="p-4 bg-[#121620] border-t border-[#1C2230] flex items-center justify-center gap-4 z-20 shrink-0">
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
        .react-pdf__Document {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .pdf-page-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .react-pdf__Page__canvas {
          margin: 0 auto;
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          object-fit: contain;
        }
        .html-book {
          background-color: transparent;
        }
        .stf__wrapper {
          background: transparent !important;
        }
        /* Disable text selection and interaction on the PDF overlay */
        .react-pdf__Page__textContent {
          user-select: none !important;
          pointer-events: none !important;
        }
        .react-pdf__Page__annotations {
          display: none !important;
        }
        /* Custom scrollbar for container */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #060709;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1C2230;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2C364A;
        }
      `}} />
    </div>
  );
}
