import React from 'react'

export default function PoSearch(props) {
  let timer

  const filterTable = (e) => {
    const currentData = { ...props.allData }
    const val = e.target.value
    clearTimeout(timer)
    timer = setTimeout(() => props.delayFiltering(currentData, val), 250)
  }

  return (
    <>
      {/* <label for="filter">Search Filter</label> */}
     
        <input
          id="filter"
          className="col-sm-4 col-md-4 col-lg-2 pl-1 theader-hide stheader-hide round1 searchbox"
          type="search"
          autoComplete="off"
          name="filter"
          onChange={filterTable}
          placeholder="Search"
        />
     
        <small className="col-sm-12 col-md-4 col-lg-2 center pt-5">click column header to sort</small>
    </>
  )
}
