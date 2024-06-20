import React from 'react';

export default function PagerDetails({pageNum, pagesTotal} : any) {

  return (
    <div className={"pagerDetails"}>
      Page {pageNum} of {pagesTotal}
    </div>

  );

}
