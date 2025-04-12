import Image from "next/image";

export default function GardenTopFold() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Image
          src={"/images/panny-baby-logo.webp"}
          alt="logo"
          priority={true}
          width={70}
          height={70}
        />
        <div
          style={{
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <h2>Panny</h2>
          <h4>A Houseplant Assistant </h4>
        </div>
      </div>

      <div>
        <h4>Weather Today</h4>
        <a>Cel: 34oC</a>
      </div>
    </div>
  );
}
