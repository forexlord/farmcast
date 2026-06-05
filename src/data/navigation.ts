export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Forecast", href: "/forecast" },
  { label: "Field Scan", href: "/field-scan" },
];

export const footerLinks = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "API Status", href: "#" },
] as const;

export const profileImages = {
  dashboard:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC-0XiwH-dfXBBI2HtkJ8R5OL0qEuNU38UOr6OW7LEEJUVHXVHPQqKQeDSVpp8vWUGJz6TAsbxrQH9kHxkw31nqAwqeIKa3Kop_ra4qxsIpb3sHXeYGDPrqT-swGJeJO6iZiiO6RgDoJsIVuRCwOd6IRSv5Thn57VDaZAeXi8PprpS3kSmUvBsfmIVkBVvKHe3bAkW03udFW7-Dor7RW0CDLpdEJlN1xil1S74irVlG8e39TbYqhHDZCL4g3ydUm0miutebNgD3e6Vj",
  forecast:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDe37Ws-07X-GEshgh0nJ6nCjLnce4WITCq2JGZd1-DPGgtTOIOKkjx6tbvmP0XuJFNv1uspL5vkxWkxENxApfIwzVqhOu0d7Yy3nFBPqisKWkeBdA1s6ddEXoDD4kN_70COittylz7C6hAJvUA7RigM88ZvPPYkFwTfgTJPh8-YqAP89wqMuVMsjDyybslWQffaIzu8KnDKwh1XfqPYITsFCfBcEanTviZY1jwS_zSFFcE8FgluaIxvoaZzyIyprFKuww4bBOZXyrL",
  fieldScan:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuALscaYot0i6VaI14JVeJ5JBGKgFSxYCQp1cKpMZhjE1AyIKhXia4JX-2zJAReHNMzwS5Hm_8zuE7YjyCSnZL7Xr6zPdQy77_V9NNgAMRyjUw5GqPFjVWQn_PEtrjtpaDcf2oM6Hj0ztBlR9cBy7Wai1AwpUrS94fBd5ur1kSXG1Uc47wfUediCcCW_v3d0O_-grF70f975CqZCP4T96jlhtH2SaymyJcJ9A8WDboYT-b1Spcbl9xX0PbrVyA5dxSHgvtfMx-1h4sJR",
} as const;

export function isNavActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
