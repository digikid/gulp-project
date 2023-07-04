export default [...Array(10).keys()].map(index => ({
  index,
  title: `Cat #${index}`,
  thumb: `https://source.unsplash.com/random/?cat&${index}`,
  description: `This is a text description for cat #${index}`
}));
