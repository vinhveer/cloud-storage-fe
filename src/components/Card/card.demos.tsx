import Card from '@/components/Card'

export function CardBasicDemo() {
  return (
    <div className="grid gap-4 mt-4">
      <Card title="Card cơ bản" subtitle="Mô tả ngắn">
        <p>Đặt nội dung tự do bên trong thẻ Card.</p>
        <p>Dùng để nhóm thông tin thành khối rõ ràng.</p>
      </Card>
      <Card>
        <p>Card không tiêu đề/mô tả.</p>
      </Card>
    </div>
  )
}

export function CardPaddingDemo() {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      <Card title="padding='sm'" padding="sm">
        <p>Nội dung với khoảng đệm nhỏ.</p>
      </Card>
      <Card title="padding='md'" padding="md">
        <p>Nội dung với khoảng đệm vừa.</p>
      </Card>
      <Card title="padding='lg'" padding="lg">
        <p>Nội dung với khoảng đệm lớn.</p>
      </Card>
      <Card title="padding='xl'" padding="xl">
        <p>Nội dung với khoảng đệm rất lớn.</p>
      </Card>
      <Card title="padding='none'" padding="none">
        <p className="p-2 bg-gray-50 dark:bg-gray-800 dark:text-gray-200">Không áp lớp padding, ví dụ thêm padding nội bộ tùy ý.</p>
      </Card>
    </div>
  )
}

export function CardShadowBorderDemo() {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      <Card title="shadow='sm'" shadow="sm">
        <p>Đổ bóng nhẹ.</p>
      </Card>
      <Card title="shadow='md'" shadow="md">
        <p>Đổ bóng vừa.</p>
      </Card>
      <Card title="shadow='lg'" shadow="lg">
        <p>Đổ bóng lớn.</p>
      </Card>
      <Card title="shadow='xl'" shadow="xl">
        <p>Đổ bóng rất lớn.</p>
      </Card>
      <Card title="shadow='2xl'" shadow="2xl">
        <p>Đổ bóng cực lớn.</p>
      </Card>
      <Card title="border=false" border={false}>
        <p>Không hiển thị viền.</p>
      </Card>
    </div>
  )
}


