// convertHeightToMeters.tsx
export type HeightUnit = "m" | "cm" | "ft";

interface ConvertHeightParams {
  height: string;
  feet?: string;
  inches?: string;
  heightUnit: HeightUnit;
}

export const convertHeightToMeters = ({
  height,
  feet = "",
  inches = "",
  heightUnit,
}: ConvertHeightParams): string => {
  let heightInMeters = parseFloat(height);
  if (heightUnit === "cm") {
    heightInMeters = heightInMeters / 100; // Convert cm to meters
  } else if (heightUnit === "ft") {
    const heightInFeet = parseFloat(feet) * 0.3048; // Convert feet to meters
    const heightInInches = parseFloat(inches) * 0.0254; // Convert inches to meters
    heightInMeters = heightInFeet + heightInInches;
  }
  return heightInMeters.toFixed(2); // Return height with 2 decimal places
};
