const {Schema, model, default: mongoose, Types} = require("mongoose");


const UserSchema = new Schema({
    firstName:String,
    lastName:String,
    corporateId:String,
    userId:String,
    password:String,

    userType:{
        type:String,
        enum:["admin", "sub_admin", "company", "staff", "employee"],
    },
    hodId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    parentHods:[Types.ObjectId],

    details:{
      incentiveRate:Number,
      wageRate:Number,
      earningHeads:{}
    },

    status:{
        type:String,
        enum:["pending", "active", "inactive", "deleted"],
        default:"active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{
    toJSON: { virtuals: true }, // Include virtuals in the output
    toObject: { virtuals: true }
})

UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for fullName
UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

const User = model('users', UserSchema);
module.exports = User