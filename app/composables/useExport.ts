export function useExport() {
  const toast = useAppToast()
  const { t } = useI18n()

  // Export data as CSV
  function exportCsv<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; header: string }[]
  ) {
    if (!data.length) {
      toast.warning(t('common.noDataToExport'))
      return
    }

    // Determine columns
    const cols = columns || Object.keys(data[0]).map(key => ({
      key: key as keyof T,
      header: key
    }))

    // Build CSV content
    const headers = cols.map(c => `"${c.header}"`).join(',')
    const rows = data.map(row =>
      cols.map(c => {
        const value = row[c.key]
        if (value === null || value === undefined) return ''
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`
        return String(value)
      }).join(',')
    )

    const csvContent = [headers, ...rows].join('\n')

    // Add BOM for Excel UTF-8 support
    const bom = '\uFEFF'
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })

    downloadBlob(blob, `${filename}.csv`)
    toast.success(t('common.exportSuccess'))
  }

  // Export data as JSON
  function exportJson<T>(data: T, filename: string) {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })

    downloadBlob(blob, `${filename}.json`)
    toast.success(t('common.exportSuccess'))
  }

  // Download blob helper
  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Print helper
  function print(elementId?: string) {
    if (elementId) {
      const element = document.getElementById(elementId)
      if (!element) {
        toast.error(t('errors.elementNotFound'))
        return
      }

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast.error(t('errors.popupBlocked'))
        return
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    } else {
      window.print()
    }
  }

  return {
    exportCsv,
    exportJson,
    downloadBlob,
    print
  }
}
