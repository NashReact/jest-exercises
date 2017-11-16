// In a real world this would have api logic
// since I have tight on time just simple thing

export default {
  get: (id) => {
    return {
      id,
      title: 'Real Event',
      description: 'This is the description of the real event that I made up in the eventApi',
    }
  },
};