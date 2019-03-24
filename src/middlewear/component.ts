import Setup from "../Setup";

export default (key, value) => (setup: Setup) => {
  setup.components[key] = value;
};
