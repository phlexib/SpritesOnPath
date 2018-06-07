///// START effPROPERTY

/**
 * Effector Property class
 * @param {Property} prop The property to be affected by effector
 * @param {Number} min The min value to map for the
 * @param {Number} max The max value to map for the
 * @return {EffPropertry} 
 */

function EffPropertry(prop, max, min) {
  
    var PROP_TYPE = {
    ONE_D: 1,
    TWO_D: 2,
    THREE_D: 3,
    COLOR: 4,
    ANGLE: "angle"
  };

 
 
  /**
   * Get dimension of the property, To be used by the Effector.
   */
  function propDimension() {
    // Always best to check if it's safe before adding:
    switch (prop.propertyValueType) {
      case PropertyValueType.NO_VALUE: { // property without a value
        alert("I Can't use that property");
        break;
      }
      case PropertyValueType.OneD: { // property with a single value
        return PROP_TYPE.ONE_D;
        break;
      }
      case PropertyValueType.TwoD: { // property with an array
        return PROP_TYPE.TWO_D;
        break;
      }
      case PropertyValueType.TwoD_SPATIAL: {
        return PROP_TYPE.TWO_D;
        break;
      }
      case PropertyValueType.ThreeD: {
        return PROP_TYPE.THREE_D;
        break;
      }
      case PropertyValueType.ThreeD_SPATIAL: {
        return PROP_TYPE.THREE_D;
        break;
      }
      case PropertyValueType.COLOR: { // property with a color
        return PROP_TYPE.COLOR;
        break;
      }
      case PropertyValueType.CUSTOM_VALUE: { // property with a custom value
        alert("Unknown Property");
      }
      default:
    }
  }

  function getName(){
      return prop.name;
  }

  this.dimension = propDimension(prop);
  this.min = min;
  this.max = max;
  this.matchName = prop.parentProperty.matchName;
  this.name = getName();
  this.prop = prop;
  this.index = prop.propertyIndex;
}

//// END effProperty