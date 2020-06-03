import moment from 'moment';

const build = (accounts) => {
  let errors = [];
  let pending = [];


  const cleansBond = accounts.filter((account) => {
    if (!account) {
      return;
    }
    
    let found = true;

    return found;
  });
  
  const data = errors.concat(cleansBond);

  var orderedDates = [];

  Object.keys(data).sort((a, b) => {
    return (moment(data[a].createdAt) < moment(data[b].createdAt)) ? 1 : -1;
  }).forEach(function(key) {
      orderedDates.push(data[key]);
  });

  const completed = [];


  return completed.concat(pending.concat(orderedDates));
};


export default {
  build,
};
