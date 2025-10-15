import { FileCard } from '@/components/FileCard/FileCard'

export function FileCardBasicDemo() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FileCard
        title="Báo cáo dự án"
        subtitle="Cập nhật 10/10/2025"
        icon="file-alt"
        detailsHref="#"
      />
      <FileCard
        title="Tổng hợp chi phí"
        subtitle="CSV • 24 KB"
        icon="file-csv"
        detailsHref="#"
      />
    </div>
  )
}

export function FileCardWidthDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <FileCard
        title="Thiết kế UI"
        subtitle="Figma"
        icon="file-image"
        width={32}
      />
      <FileCard
        title="Kế hoạch Q4"
        subtitle="DOCX"
        icon="file-word"
        width={32}
      />
      <FileCard
        title="Dữ liệu khách hàng"
        subtitle="XLSX"
        icon="file-excel"
        width={32}
      />
      <FileCard
        title="Tổng hợp KPI"
        subtitle="PDF"
        icon="file-pdf"
        width={48}
      />
      <FileCard
        title="Biên bản họp"
        subtitle="TXT"
        icon="file-lines"
        width={48}
      />
    </div>
  )
}

export function FileCardIconDemo() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <FileCard
        title="Tài liệu dự án"
        subtitle="PDF"
        icon="file-pdf"
        iconColor="text-red-600 dark:text-red-400"
      />
      <FileCard
        title="Bảng tính ngân sách"
        subtitle="XLSX"
        icon="file-excel"
        iconColor="text-green-600 dark:text-green-400"
      />
      <FileCard
        title="Hồ sơ nhân sự"
        subtitle="Thư mục"
        icon="folder"
        iconColor="text-yellow-500 dark:text-yellow-400"
      />
    </div>
  )
}
