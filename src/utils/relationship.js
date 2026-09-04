import { Cardinality } from "../data/constants";

export const getCardinalityText = (cardinality) => {
  switch (cardinality) {
    case Cardinality.ONE_TO_ONE:
      return "1:1";
    case Cardinality.ONE_TO_MANY:
      return "1:N";
    case Cardinality.MANY_TO_ONE:
      return "N:1";
    case Cardinality.MANY_TO_MANY:
      return "N:M";
    default:
      return "1:1";
  }
};

