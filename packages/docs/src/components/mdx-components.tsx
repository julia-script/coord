import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";
import { PreMDX } from "@/components";

const components = {
  Image,
  pre: PreMDX,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return <Component components={components} />;
}
