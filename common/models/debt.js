'use strict';

module.exports = function(Debt) {
    Debt.getUnmatched = () => {
        const debts = Debt.find({
            include: ['community', 'payments'],
            limit: 200,
            where: {
                invalid: 0
            }
        });

        return debts.filter(debt => debt.payments().length === 0);
    }

    Debt.getMatched = () => {
        const debts = Debt.find({
            include: ['payments', 'community'],
            where: {
                invalid: 0
            }
        });

        return debts.filter(debt => debt.payments().length > 0);
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

    Debt.remoteMethod('getMatched', {
        http: {
            verb: 'get'
        },
        returns: {
            type: 'array',
            root: true
        }
    });
};
