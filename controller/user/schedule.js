const workoutsLog = require("./workoutsLog.js") 
const nutritionLog = require("./nutritionLog.js") 
const { error } = require("console");



async function getSchedule(user_id){
    try {
        const [nutrition, workouts] = await Promise.all([
            nutritionLog.queryUserNutritionLog(user_id),
            workoutsLog.queryUserWorkoutsLog(user_id)
        ])

        const schedule = [...nutrition,...workouts];

        schedule.sort((a,b)=> new Date(a.dt_planned) - new Date(b.dt_planned))

        return schedule
 
    } catch (error) {
        throw error
    }




}

module.exports ={
    getSchedule
}