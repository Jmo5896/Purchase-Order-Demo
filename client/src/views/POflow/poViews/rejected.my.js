import React, { useEffect, useState, useCallback } from 'react'
import trashIcon from 'bootstrap-icons/icons/trash-fill.svg'

import API from '../../../services/poflow.service'
import Loading from '../../../components/Loading'
import ModalButton from '../../../components/Modal'
import DeletePoForm from '../../../components/Forms/Delete/PO.delete'
import RejectRequestForm from '../../../components/Forms/Update/PO.reject'
import PoSearch from '../poSearch'

export default function MyRejected(props) {
  const [allData, setData] = useState({ content: [], filteredContent: [] })
  const [isLoading, setLoading] = useState(true)
  const [colFilter, setColFilter] = useState({ col: '', order: true })

  const delayFiltering = useCallback((currentData, filter) => {
    currentData.filteredContent = currentData.content.filter(
      (row) =>
        row.header.stage.date.includes(filter) ||
        row.header.requisitionId.toUpperCase().includes(filter.toUpperCase()) ||
        row.header.stage.switch.toUpperCase().includes(filter.toUpperCase()) ||
        row.header.stage.vendor.toUpperCase().includes(filter.toUpperCase()) ||
        row.header.total.includes(filter)
    )
    setData(currentData)
  }, [])

  useEffect(() => {
    const currentContent = [...allData.filteredContent]
    let sortFunc
    let currentCol = colFilter.col.split('-')
    if (currentCol.length > 1) {
      if (colFilter.col.includes('date')) {
        if (colFilter.order) {
          sortFunc = (a, b) =>
            new Date(a.header[currentCol[0]][currentCol[1]]) -
            new Date(b.header[currentCol[0]][currentCol[1]])
        } else {
          sortFunc = (a, b) =>
            new Date(b.header[currentCol[0]][currentCol[1]]) -
            new Date(a.header[currentCol[0]][currentCol[1]])
        }
      } else {
        if (colFilter.order) {
          sortFunc = (a, b) => {
            const aVal = a.header[currentCol[0]][currentCol[1]].toUpperCase()
            const bVal = b.header[currentCol[0]][currentCol[1]].toUpperCase()
            if (aVal < bVal) {
              return -1
            }
            if (aVal > bVal) {
              return 1
            }
            return 0
          }
        } else {
          sortFunc = (a, b) => {
            const aVal = a.header[currentCol[0]][currentCol[1]].toUpperCase()
            const bVal = b.header[currentCol[0]][currentCol[1]].toUpperCase()
            if (aVal < bVal) {
              return 1
            }
            if (aVal > bVal) {
              return -1
            }
            return 0
          }
        }
      }
    } else {
      const myC = currentCol[0]
      if (myC === 'total') {
        if (colFilter.order) {
          sortFunc = (a, b) => a.header[myC] - b.header[myC]
        } else {
          sortFunc = (a, b) => b.header[myC] - a.header[myC]
        }
      } else {
        if (colFilter.order) {
          sortFunc = (a, b) => {
            const aVal = a.header[myC].toUpperCase()
            const bVal = b.header[myC].toUpperCase()
            if (aVal < bVal) {
              return -1
            }
            if (aVal > bVal) {
              return 1
            }
            return 0
          }
        } else {
          sortFunc = (a, b) => {
            const aVal = a.header[myC].toUpperCase()
            const bVal = b.header[myC].toUpperCase()
            if (aVal < bVal) {
              return 1
            }
            if (aVal > bVal) {
              return -1
            }
            return 0
          }
        }
      }
    }

    setData({ ...allData, filteredContent: currentContent.sort(sortFunc) })
  }, [colFilter])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.getRejected()
        setLoading(false)
        setData({ content: response.data, filteredContent: response.data })
      } catch (err) {
        console.log(err)
        // propHistory.push('/login')
        // window.location.reload()
      }
    }
    if (isLoading) {
      fetchData()
    }
  }, [isLoading])

  const sortByCol = (e) => {
    const sortPath = e.target.dataset.value
    const currentSort = { ...colFilter }
    if (currentSort.col === sortPath) {
      currentSort.order = !currentSort.order
    } else {
      currentSort.col = sortPath
      currentSort.order = true
    }
    setColFilter(currentSort)
  }

  return (
    <div className="myRejected">
      <h5>My Purchase Order Rejections</h5>
      <PoSearch allData={allData} setData={setData} delayFiltering={delayFiltering} />
      <table
        key={allData.filteredContent.length}
        className="table table-hover overflow-no"
      >
        <div className="tablehead">
          <thead className="row">
            <tr className="col row">
              <th className="col filter" onClick={sortByCol} data-value="stage-date">
                Created On
              </th>
              <th className="col filter" onClick={sortByCol} data-value="requisitionId">
                Department Code
              </th>
              <th className="col filter" onClick={sortByCol} data-value="stage-switch">
                Local or County
              </th>
              <th className="col filter" onClick={sortByCol} data-value="stage-vendor">
                Vendor
              </th>
              <th className="col filter" onClick={sortByCol} data-value="total">
                Total
              </th>
            </tr>
          </thead>
        </div>
        {isLoading && <Loading />}

        <tbody>
          <div className="scroll-window scrollbox border1 rounded">
            {allData.filteredContent &&
              allData.filteredContent.map((row, i) => (
                <div key={i}>
                  <ModalButton
                    button={true}
                    status={row.header.stage}
                    btnClasses="shadow-no fw-bold col-12 btn3"
                    btnText={
                      <tr className="row">
                        <td className="col">{row.header.stage.date}</td>
                        <td className="col">{row.header.requisitionId}</td>
                        <td className="col">{row.header.stage.switch}</td>
                        <td className="col">{row.header.stage.vendor}</td>
                        <td className="col">${row.header.total}</td>
                      </tr>
                    }
                    form={RejectRequestForm}
                    modalTitle={`Review purchase order. (${row.header.stage.date})`}
                    updateDeleteInfo={{
                      id: row.header.formId,
                      shippingHandling: row.header.shippingHandling,
                      quote: row.header.quote,
                      reason: row.header.reason,
                      setLoading,
                      data: row.data,
                      poData: row.poData
                    }}
                  />
                  <div className="trashcanbig">
                    <ModalButton
                      icon={trashIcon}
                      width={25}
                      height={25}
                      alt="Delete Purchase Order."
                      status={row.header.stage}
                      form={DeletePoForm}
                      modalTitle="Delete existing purchase order."
                      updateDeleteInfo={{
                        id: row.header.formId,
                        shippingHandling: row.header.shippingHandling,
                        quote: row.header.quote,
                        reason: row.header.reason,
                        setLoading,
                        data: row.data,
                        poData: row.poData
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </tbody>
      </table>
    </div>
  )
}
