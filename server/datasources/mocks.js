
const mocks = {
    Query: () => ({
        programmes: () => [...new Array(3)],
        techQuotes: () => [...new Array(5)]
      }),

    Programme: () => ({
        id: () => '01GD9T9T3DKZG6Y98EBNFZ0W8E',
        programmeTimestamp: () => '2022-09-19 04:47:39.887',
        programmeId: () => 'media_player.plex_plex_for_apple_tv_living_room',
        friendlyName: () => 'Plex (Plex for Apple TV - Living Room)',
        appName: () => 'plexapp',
        appId: () => 'com.plexapp.plex',
        libraryTitle: () => 'TV programmes',
        seriesTitle: () => "It's Always Sunny in Philadelphia",
        title: () => 'The Gang Gets New Wheels',
        summary: () => 'Dee gets in with a group of cool, rich housewives. Dennis hits it off with some everyday blue-collar bros. Frank struggles to renew his license. Charlie and Mac deal with a new generation of bicycle bullies.',
        season: () => 13,
        duration: () => 1418,
        position: () => 796,
        state: () => 'playing'
    }),

    TechQuote: () => ({
        id: () => '5a6ce8702af929789500e8c6',
        author: () => 'Bjarne Stroustrup',
        en: () => 'An organisation that treats its programmers as morons will soon have programmers that are willing and able to act like morons only.',
        url: () => 'https://programming-quotes-api.herokuapp.com/quotes/5a6ce8702af929789500e8c6',
        description: () => 'From the book "The C++ Programming Language" by Bjarne Stroustrup'
    })
}

module.exports =  mocks 