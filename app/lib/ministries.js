export async function getMinistryIdList() {
    return [{
      params: {
        id: 'adult'
      }
    }, {
      params: {
        id: 'children'
      }
    }, {
      params: {
        id: 'youth'
      }
    }]
  }

  export async function getMinsitryDetails(ministryId) {
    const dataSet = {
      'adult': {
        title: 'Adult Ministry',
        description: 'Lorem ipsum dolor sit amet...',
      },
      'children': {
        title: 'Children Ministry',
        description: 'Lorem ipsum dolor sit amet...',
      },
      'youth': {
        title: 'Youth Ministry',
        description: 'Lorem ipsum dolor sit amet...',
      }
    }
    return dataSet[ministryId]
  }