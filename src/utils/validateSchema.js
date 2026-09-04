import { Validator } from "jsonschema";
import { jsonSchema } from "../data/schemas";

export function jsonDiagramIsValid(obj) {
  return new Validator().validate(obj, jsonSchema).valid;
}

export function validateJsonDiagram(obj) {
  const result = new Validator().validate(obj, jsonSchema);
  return {
    valid: result.valid,
    errors:
      result.errors?.map((e) => ({
        name: e.name,
        property: e.property,
        message: e.message,
        detailedMessage: e.schema?.errorMessage || e.message,
      })) || [],
  };
}
