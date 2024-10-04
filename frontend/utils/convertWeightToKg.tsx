// Define the type for weight units
export type WeightUnit = "kg" | "lbs";

interface ConvertWeightParams {
  weight: string;
  weightUnit: WeightUnit;
}

// Function to convert weight to kg
export function convertWeightToKg({ weight, weightUnit }: ConvertWeightParams): string {
  let weightInKg = parseFloat(weight);
  if (weightUnit === "lbs") {
    weightInKg = weightInKg * 0.453592;
  }
  return weightInKg.toString();
}
