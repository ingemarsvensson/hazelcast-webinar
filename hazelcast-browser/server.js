'use strict';

var express = require('express'),
	router = express.Router(),
	app = express();


function logger() {
	var str = new Date().toString()+"\t"+Array.prototype.join.call(arguments,"\t");
	console.log(str);
	// if (config.express.logfile && config.express.logfile != '') {
	// 	fs.appendFile(config.express.logfile, str+"\r\n", function(err) {
	// 		if (err) console.log('ERROR', err);
	// 	});
	// }
}

process.on('uncaughtException', function (err) {
	// logger('UNCAUGHT EXCEPTION', err.stack);
});

router.use(function(res,req,next) {
	logger(req.req.method,req.req.url);
	next();
});

router.get('/config', function(req,res) {
	//res.send({enterprise:config.enterprise,user:{dn:req.user.displayName,uid:req.user.uid}});
	res.send({});
});

router.get('/logout', function(req,res) {
	res.send(401);
});

router.get('/cancel/:id', function(req,res) {
	// http.request({
	// 	host:config.enterprise.host,
	// 	port:config.enterprise.port,
	// 	path:'/enterprise/rest/job/cancel/'+req.params.id,
	// 	method:'POST'
	// }, function(response) {
	// 	res.send(response);
	// });
});

router.get('/jobs', function(req,res) {

/*
	var page = Math.max(parseInt(req.query.page),1) || 1,
		size = Math.max(parseInt(req.query.size),1) || 20,
		sqlString = '';

	Object.keys(req.query).forEach(function(filter) {
		if (req.query[filter] == '') return;
		switch(filter) {
			case "BenchmarkName":
				sqlString += " AND t3.CompositionName = '"+req.query[filter].replace(/[^a-z0-9_-\s+.]/gmi, "")+"'";
				break;
			case "TenantID":
				sqlString += " AND t5.TenantID = '"+req.query[filter].replace(/[^0-9]/gmi, "")+"'";
				break;
			case "ModelName":
				sqlString += " AND t1.ModelName = '"+req.query[filter].replace(/[^a-z0-9_-\s]/gmi, "")+"'";
				break;
			case "ModelDate":
				sqlString += " AND t1.ModelDate = '"+req.query[filter].replace(/[^tz0-9:.-]/gmi, '')+"'";
				break;
			case "PortfolioName":
				sqlString += " AND t9.CompositionName = '"+req.query[filter].replace(/[^a-z0-9._-\s+]/gmi, '')+"'";
				break;
			case "DateStart":
				sqlString += " AND t1.CreatedDate >= '"+moment(req.query[filter]).format('YYYY-MM-DD 00:00:00')+"'";
				break;
			case "JobDefinitionName":
				sqlString += " AND t7.Name = '"+req.query[filter].replace(/[^a-z0-9-_\s+.]/gmi, '')+"'";
				break;
			case "DateEnd":
				var timestamp = moment(req.query[filter]).format('YYYY-MM-DD 23:59:59');
				sqlString += " AND ((t1.FailedTimestamp <= '"+timestamp+"' OR t1.CompletedTimestamp <= '"+timestamp+"') OR (t1.FailedTimestamp IS NULL AND t1.CompletedTimestamp IS NULL))";
				break;
		}
	});

	//var sqlQuery = "SELECT t1.JobExecutionID, t1.AnalyticsResponse, t1.BenchmarkCoveragePercent, t1.CompletedTimestamp, t1.CoverageThreshold, t1.CreateCompositionForGroup, t1.CreatedBy AS JobExecutionCreatedBy, t1.CreatedDate AS JobExecutionCreatedDate, t1.DataPreference, t1.EffectiveModelDate,  t1.EffectiveValuationDate,  t1.FailedTimestamp,  t1.IncludeHistoricScenarios,  t1.ModelDate,  t1.ModelName,  t1.PortfolioCoveragePercent,  t1.ScenarioCount,  t1.ScenarioTotal,  t1.SubmittedTimestamp,  t1.SystematicSpecificAttribution,  t1.ValuationDate,  t1.OptLock,  t1.WeightScaling,  t1.BenchmarkID,  t1.CompositionKey,  t1.JobCompositionID,  t1.JobUploadID,  t0.CompositionCode,  t0.CreatedBy AS CompositionKeyCreatedBy,  t0.CreatedDate AS CompositionKeyCreatedDate,  t0.IsDummy,  t0.TenantID, t7.Name AS BenchmarkName, t3.CompositionName FROM  Job.JobExecution t1 LEFT OUTER JOIN Prd.CompositionKey t0 ON (t0.CompositionKey = t1.CompositionKey) LEFT OUTER JOIN Prd.Composition t4 ON ( (t4.CompositionKey = t0.CompositionKey) AND ( ( (t4.FromDate IS NULL) OR (t4.FromDate <= t1.ValuationDate) ) AND ( (t4.ToDate IS NULL) OR (t4.ToDate >= t1.ValuationDate) ) ) ) LEFT OUTER JOIN Prd.CompositionKey t2 ON (t2.CompositionKey = t1.BenchmarkID) LEFT OUTER JOIN Prd.Composition t3 ON ( (t3.CompositionKey = t2.CompositionKey) AND ( ( (t3.FromDate IS NULL) OR (t3.FromDate <= t1.ValuationDate) ) AND ( (t3.ToDate IS NULL) OR (t3.ToDate >= t1.ValuationDate) ) ) ) LEFT OUTER JOIN Job.JobComposition t6 ON (t1.JobCompositionID = t6.JobCompositionID) LEFT OUTER JOIN Job.JobDefinition t7 ON (t7.JobDefinitionID = t6.JobDefinitionID), Prd.Tenant t5 WHERE (t5.TenantID = t0.TenantID) "+sqlString+" ORDER BY t1.JobExecutionID DESC";
	var sqlQuery = "SELECT t1.JobExecutionID, t1.AnalyticsResponse, t1.BenchmarkCoveragePercent, t1.CompletedTimestamp, t1.CoverageThreshold, t1.CreateCompositionForGroup, t1.CreatedBy AS JobExecutionCreatedBy, t1.CreatedDate AS JobExecutionCreatedDate, t1.DataPreference, t1.EffectiveModelDate,  t1.EffectiveValuationDate, t1.FailedTimestamp,  t1.IncludeHistoricScenarios,  t1.ModelDate,  t1.ModelName,  t1.PortfolioCoveragePercent,  t1.ScenarioCount,  t1.ScenarioTotal, t1.SubmittedTimestamp,  t1.SystematicSpecificAttribution,  t1.ValuationDate,  t1.OptLock,  t1.WeightScaling,  t1.BenchmarkID,  t1.CompositionKey, t1.JobCompositionID,  t1.JobUploadID,  t0.CompositionCode,  t0.CreatedBy AS CompositionKeyCreatedBy,  t0.CreatedDate AS CompositionKeyCreatedDate, t0.IsDummy,  t0.TenantID, t7.Name AS JobDefinitionName, t3.CompositionName AS BenchmarkName, t9.CompositionName AS PortfolioName FROM  Job.JobExecution t1 LEFT OUTER JOIN Prd.CompositionKey t0 ON (t0.CompositionKey = t1.CompositionKey) LEFT OUTER JOIN Prd.Composition t4 ON ( (t4.CompositionKey = t0.CompositionKey) AND ( ( (t4.FromDate IS NULL) OR (t4.FromDate <= t1.ValuationDate) ) AND ( (t4.ToDate IS NULL) OR (t4.ToDate >= t1.ValuationDate) ) ) ) LEFT OUTER JOIN Prd.CompositionKey t2 ON (t2.CompositionKey = t1.BenchmarkID) LEFT OUTER JOIN Prd.CompositionKey t8 ON (t8.CompositionKey = t1.CompositionKey) LEFT OUTER JOIN Prd.Composition t3 ON ( (t3.CompositionKey = t2.CompositionKey) AND ( ( (t3.FromDate IS NULL) OR (t3.FromDate <= t1.ValuationDate) ) AND ( (t3.ToDate IS NULL) OR (t3.ToDate >= t1.ValuationDate) ) ) ) LEFT OUTER JOIN Prd.Composition t9 ON ( (t9.CompositionKey = t8.CompositionKey) AND ( ( (t9.FromDate IS NULL) OR (t3.FromDate <= t1.ValuationDate) ) AND ( (t9.ToDate IS NULL) OR (t9.ToDate >= t1.ValuationDate) ) ) ) LEFT OUTER JOIN Job.JobComposition t6 ON (t1.JobCompositionID = t6.JobCompositionID) LEFT OUTER JOIN Job.JobDefinition t7 ON (t7.JobDefinitionID = t6.JobDefinitionID), Prd.Tenant t5 WHERE (t5.TenantID = t0.TenantID) "+sqlString+" ORDER BY t1.JobExecutionID DESC"
	query(sqlQuery, function(err, results) {
		res.send(err ? {error:err} : {results:results.slice((page-1)*size,page*size),pagination:{results:results.length,page:page,size:size}});
	}, req.user.uid);
	*/
});	

router.get('/tenants', function(req,res) {
	// query("SELECT TenantID, TenantCode FROM Prd.Tenant", function(err,results) {
	// 	res.send(results);
	// }, req.user.uid);
});

// app.use(basicAuth(function(user,pass,callback) {
// 	// ldap.authenticate(user,pass,function(err,user) {
// 	// 	callback(err ? true : false, err || user);
// 	//});
// }));
app.use('/api', router);
app.use(express.static(__dirname+'/app'));
app.listen(8888);