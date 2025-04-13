import Image from "next/image";

interface Plant {
  name: string;
  imageUrl: string;
  healthCondition: string;
  waterNeed: string;
}

export const PlantCard = ({ plant }: { plant: Plant }) => {
  return (
    <div
      style={{
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        maxWidth: "300px",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "0",
          paddingBottom: "133.33%",
        }}
      >
        <Image
          src={plant.imageUrl}
          alt={plant.name}
          fill
          sizes="300px"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority={false}
          loading={"lazy"}
        />
      </div>
      <div style={{ padding: "16px" }}>
        <h3 style={{ margin: "0 0 8px 0" }}>{plant.name}</h3>

        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontWeight: "bold", marginRight: "8px" }}>
            Health:
          </span>
          <span>{plant.healthCondition}</span>
        </div>

        <div>
          <span style={{ fontWeight: "bold", marginRight: "8px" }}>
            Water need:
          </span>
          <span>{plant.waterNeed}</span>
        </div>
      </div>
    </div>
  );
};
