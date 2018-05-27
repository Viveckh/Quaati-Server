import _ from 'lodash'

export default {

    /**
     * Personality: 80%
     * Interest: 5%
     * Music Interst: 10%
     * Organizations: 5%
     * @param {*} user 
     * @param {*} matches 
     */
    computeScores(user, matches){
        let personalityKeys = Object.keys(user.personality);

        matches.forEach(match => {
            let personaDiff = 0;
            
            personalityKeys.forEach(key => {
                personaDiff += Math.abs(user.personality[key] - match.personality[key]);
            });

            personaDiff = (personalityKeys.length * 10) - personaDiff; // Discounting the difference with total personality score to get similarity.
            personaDiff = personaDiff / (personalityKeys.length *10); // Divide by total to get it from 0 - 1.
            personaDiff = personaDiff * 0.8; // Personality difference accounts for 80% of the scoring.

            // console.log("Personality Score: ", personaDiff);
            
            let similarInterests = _.intersection(user.interests, match.interests);

            let interestScore = similarInterests.length / user.interests.length;
            interestScore = interestScore * 0.05;
            // console.log("Interest Score: ", interestScore);

            let similarMusic = _.intersection(user.music_interests, match.music_interests);
            let musicScore = similarMusic.length / user.music_interests.length;
            musicScore = musicScore * 0.1;
            // console.log("Music Score: ", musicScore);

            let similarOrg = _.intersection(user.organizations, match.organizations);
            let orgScore = similarOrg.length / user.organizations.length;
            orgScore = orgScore * 0.05;
            // console.log("Organization Score: ", orgScore);

            match['score'] = personaDiff + interestScore + musicScore + orgScore;
            console.log("Total Score: ", match['score']);
        })

        let sorted = _.orderBy(matches, ['score'], ['desc']);

        sorted.forEach(v => {
            console.log("Sorted: ", v.score)
        })
        
        return sorted;
        
    }
}