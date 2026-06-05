export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Forecast", href: "/forecast" },
  { label: "Field Scan", href: "/field-scan" },
];

export const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC-0XiwH-dfXBBI2HtkJ8R5OL0qEuNU38UOr6OW7LEEJUVHXVHPQqKQeDSVpp8vWUGJz6TAsbxrQH9kHxkw31nqAwqeIKa3Kop_ra4qxsIpb3sHXeYGDPrqT-swGJeJO6iZiiO6RgDoJsIVuRCwOd6IRSv5Thn57VDaZAeXi8PprpS3kSmUvBsfmIVkBVvKHe3bAkW03udFW7-Dor7RW0CDLpdEJlN1xil1S74irVlG8e39TbYqhHDZCL4g3ydUm0miutebNgD3e6Vj";

export function isNavActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
