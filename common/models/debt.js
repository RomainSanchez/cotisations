'use strict';

module.exports = function(Debt) {
    Debt.getUnmatched = async () => {
        const debts = Debt.find({
            include: ['community', 'payments']
        });

        return debts.filter(debt => debt.payments().length === 0);
    }

    Debt.remoteMethod('getUnmatched', {
        http: {
            verb: 'get'
        },
        returns: {
            type: 'array',
            root: true
        }
    });
};
