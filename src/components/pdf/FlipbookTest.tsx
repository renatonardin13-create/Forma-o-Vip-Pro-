import React, { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const Page = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div className="demoPage bg-white border border-gray-300" ref={ref}>
      <h1>Page Header</h1>
      <p>{props.children}</p>
      <p>Page number: {props.number}</p>
    </div>
  );
});

export function FlipbookTest() {
  return (
    <HTMLFlipBook width={300} height={500}>
      <Page number="1">Page text</Page>
      <Page number="2">Page text</Page>
      <Page number="3">Page text</Page>
      <Page number="4">Page text</Page>
    </HTMLFlipBook>
  );
}
