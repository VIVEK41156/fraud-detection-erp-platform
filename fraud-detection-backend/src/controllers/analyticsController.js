const Transaction =
  require("../models/Transaction");

// -------------------------
// GET ANALYTICS
// -------------------------
const getAnalytics =
  async (req, res) => {
    try {
      const transactions =
        await Transaction.find();

      const totalTransactions =
        transactions.length;

      const fraudTransactions =
        transactions.filter(
          (t) =>
            t.isFraud
        ).length;

      const safeTransactions =
        totalTransactions -
        fraudTransactions;

      const avgRiskScore =
        totalTransactions >
        0
          ? (
              transactions.reduce(
                (
                  acc,
                  curr
                ) =>
                  acc +
                  curr.riskScore,
                0
              ) /
              totalTransactions
            ).toFixed(2)
          : 0;

      // Top Locations
      const locationMap =
        {};

      transactions.forEach(
        (t) => {
          locationMap[
            t.location
          ] =
            (
              locationMap[
                t.location
              ] || 0
            ) + 1;
        }
      );

      const topLocations =
        Object.entries(
          locationMap
        )
          .map(
            (
              [
                location,
                count,
              ]
            ) => ({
              location,
              count,
            })
          )
          .sort(
            (
              a,
              b
            ) =>
              b.count -
              a.count
          )
          .slice(0, 5);

      // Top Merchants
      const merchantMap =
        {};

      transactions.forEach(
        (t) => {
          merchantMap[
            t.merchantName
          ] =
            (
              merchantMap[
                t.merchantName
              ] || 0
            ) + 1;
        }
      );

      const topMerchants =
        Object.entries(
          merchantMap
        )
          .map(
            (
              [
                merchant,
                count,
              ]
            ) => ({
              merchant,
              count,
            })
          )
          .sort(
            (
              a,
              b
            ) =>
              b.count -
              a.count
          )
          .slice(0, 5);

      // Monthly Fraud
      const monthlyMap =
        {};

      transactions.forEach(
        (t) => {
          const month =
            new Date(
              t.createdAt
            ).toLocaleString(
              "default",
              {
                month:
                  "short",
              }
            );

          if (
            !monthlyMap[
              month
            ]
          ) {
            monthlyMap[
              month
            ] = 0;
          }

          if (
            t.isFraud
          ) {
            monthlyMap[
              month
            ] += 1;
          }
        }
      );

      const monthlyFrauds =
        Object.entries(
          monthlyMap
        ).map(
          (
            [
              month,
              frauds,
            ]
          ) => ({
            month,
            frauds,
          })
        );

      return res
        .status(200)
        .json({
          success:
            true,

          analytics:
            {
              totalTransactions,
              fraudTransactions,
              safeTransactions,
              avgRiskScore,
              topLocations,
              topMerchants,
              monthlyFrauds,
            },
        });
    } catch (
      error
    ) {
      return res
        .status(500)
        .json({
          success:
            false,
          message:
            error.message,
        });
    }
  };

module.exports = {
  getAnalytics,
};