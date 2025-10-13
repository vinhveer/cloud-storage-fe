import { FileCard } from '@/components/FileCard'

export function FileCardBasicDemo() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FileCard
        title="Báo cáo dự án"
        subtitle="Cập nhật 10/10/2025"
        iconClass="fas fa-file-alt"
        detailsHref="#"
      />
      <FileCard
        title="Tổng hợp chi phí"
        subtitle="CSV • 24 KB"
        iconClass="fas fa-file-csv"
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
        iconClass="fas fa-file-image"
        width={32}
      />
      <FileCard
        title="Kế hoạch Q4"
        subtitle="DOCX"
        iconClass="fas fa-file-word"
        width={32}
      />
      <FileCard
        title="Dữ liệu khách hàng"
        subtitle="XLSX"
        iconClass="fas fa-file-excel"
        width={32}
      />
      <FileCard
        title="Tổng hợp KPI"
        subtitle="PDF"
        iconClass="fas fa-file-pdf"
        width={48}
      />
      <FileCard
        title="Biên bản họp"
        subtitle="TXT"
        iconClass="fas fa-file-lines"
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
        iconClass="fas fa-file-pdf text-red-600"
      />
      <FileCard
        title="Bảng tính ngân sách"
        subtitle="XLSX"
        iconClass="fas fa-file-excel text-green-600"
      />
      <FileCard
        title="Hồ sơ nhân sự"
        subtitle="Thư mục"
        iconClass="fas fa-folder text-yellow-500"
      />
    </div>
  )
}
