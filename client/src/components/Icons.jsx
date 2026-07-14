function Icon({ size = 24, strokeWidth = 2, children, ...props }) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function ArrowLeft(props) {
  return (
    <Icon {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Icon>
  );
}

export function House(props) {
  return (
    <Icon {...props}>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </Icon>
  );
}

export function Bell(props) {
  return (
    <Icon {...props}>
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 22h4" />
    </Icon>
  );
}

export function Bookmark(props) {
  return (
    <Icon {...props}>
      <path d="M6 3h12v18l-6-4-6 4z" />
    </Icon>
  );
}

export function Heart(props) {
  return (
    <Icon {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l7.8-8.6a5.5 5.5 0 0 0 1-7.8Z" />
    </Icon>
  );
}

export function Send(props) {
  return (
    <Icon {...props}>
      <path d="m21 3-7 18-4-7-7-4z" />
      <path d="m10 14 4-4" />
    </Icon>
  );
}