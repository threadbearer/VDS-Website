interface JsonLdProps {
  data: Record<string, any>;
  id?: string;
}

export default function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c") // security hardening
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
