/*! This is open-source. Feel free to use, modify, redistribute, and so on.
 */
examples = {};
examples.smallExample = function () {
	ui.clearDiagram();
	var actor = istar.addActor(49,49,'a1');
	this.goal1 = istar.addGoal(200,88,'g1');istar.embedNode(this.goal1, actor);
	this.goal2 = istar.addGoal(110,170,'g2');istar.embedNode(this.goal2, actor);
	this.goal3 = istar.addGoal(267,170,'g3');istar.embedNode(this.goal3, actor);
	this.quality1 = istar.addQuality(510,250,'q1');istar.embedNode(this.quality1, actor);
	this.quality2 = istar.addQuality(440,100,'q2');istar.embedNode(this.quality2, actor);
	this.task1 = istar.addTask(150,270,'t1');istar.embedNode(this.task1, actor);
	this.task2 = istar.addTask(315,260,'t2');istar.embedNode(this.task2, actor);
	this.resource1 = istar.addResource(335,340,'r1');istar.embedNode(this.resource1, actor);
	this.resource2 = istar.addResource(560,180,'r2');istar.embedNode(this.resource2, actor);
	istar.addAndRefinementLink(this.goal2, this.goal1);
	istar.addAndRefinementLink(this.goal3, this.goal1);
	istar.addOrRefinementLink(this.task1, this.goal3);
	istar.addOrRefinementLink(this.task2, this.goal3);
	istar.addNeededByLink(this.resource1, this.task2);
	istar.addContributionLink(this.resource1, this.quality1, 'hurt');
	istar.addContributionLink(this.task2, this.quality2, 'make');
	istar.addQualificationLink(this.quality2, this.resource2);
	this.resource1.translate(1);//trick to resize the actor's bounday
};

examples.justAnActor = function () {
	var actor = istar.addActor(119,49,'Researcher');
	this.goal1 = istar.addGoal(200,88,'i* models created');istar.embedNode(this.goal1, actor);
};

examples.pistarIntro = function () {
	var actor = istar.addActor(119,49,'Researcher');
	this.goal1 = istar.addGoal(320,88,'i* models created');istar.embedNode(this.goal1, actor);
	this.task1 = istar.addTask(290,170,'Use piStar');istar.embedNode(this.task1, actor);
	this.quality1 = istar.addQuality(190,65,'Good Quality');istar.embedNode(this.quality1, actor);
	istar.addAndRefinementLink(this.task1, this.goal1);
	istar.addContributionLink(this.task1, this.quality1, 'help')
		.set('vertices', [{ x: 200, y: 180 }])
		.set('smooth', true)
		.on('change:vertices', ui._toggleSmoothness);;

	// console.log(link);
	this.task1.translate(1);//trick to resize the actor's bounday
};

examples.travelReimbursement = function () {
	ui.clearDiagram();
	var student = 	istar.addRole(244,29,'Student', {id:'830b5ef8-0f41-4a17-ba2a-ba4a8f4e799b'});
	student.embedNode(	istar.addGoal(598,29,'Travel organized', {id:'8f5b5975-10bc-44b5-92b2-c53e2394b2c9'})	);
	student.embedNode(	istar.addGoal(394,91,'Authorization obtained', {id:'d7350e31-1d29-46b0-bce5-e191189720cd'})	);
	student.embedNode(	istar.addGoal(321,160,'Request prepared', {id:'c3f53c8d-b421-4c60-8dbf-03b07978295b'})	);
	student.embedNode(	istar.addGoal(491,145,'Authorization signed', {id:'4e767af4-fd1e-4e3e-8a82-3740521e576a'})	);
	student.embedNode(	istar.addTask(244,229,'Fill in paper form', {id:'191249f9-d249-47db-b5f2-c09449307eb4'})	);
	student.embedNode(	istar.addTask(356,267,'Fill in online form', {id:'9bb7e927-3dee-4485-8fda-01954d324c88'})	);
	student.embedNode(	istar.addQuality(276,378,'No errors', {id:'0055d468-1097-43b2-95bf-1781730b1985'})	);
	student.embedNode(	istar.addTask(431,215,'Supervisor authorizes', {id:'37b28c3f-7554-4c62-91cd-44cac0873977'})	);
	student.embedNode(	istar.addTask(546,251,'Head-of-dept authorizes', {id:'102cbb1c-5600-4058-bed9-cc9e1ad1d9e9'})	);
	student.embedNode(	istar.addQuality(423,388,'Quick booking', {id:'0afa08e3-2306-40c8-9d40-2c144b748664'})	);
	student.embedNode(	istar.addGoal(741,184,'Trip booked', {id:'16d9b9bf-fdef-4832-8f7d-8dcb42513371'})	);
	student.embedNode(	istar.addGoal(678,261,'Trip parts booked', {id:'d8991d04-c2a6-45f0-a3ed-3ebed2a2d86d'})	);
	student.embedNode(	istar.addTask(855,281,'Bundle booked', {id:'f2ad4e2a-1b6d-44ce-94d7-28aee4e08d3d'})	);
	student.embedNode(	istar.addGoal(634,342,'Tickets booked', {id:'f34b98b9-6cba-4410-8a49-451e00049e43'})	);
	student.embedNode(	istar.addGoal(796,331,'Accommodati on booked', {id:'94b43d28-480c-4a22-92ed-c8ba69a1d111'})	);
	student.embedNode(	istar.addTask(544,410,'Agency buys tickets', {id:'4934265e-abf6-4fe1-91c9-38c2a6aadcb0'})	);
	student.embedNode(	istar.addTask(709,406,'Self-book tickets', {id:'11d870d2-7987-45c9-a36a-7b177219ae50'})	);
	student.embedNode(	istar.addGoal(811,415,'Conference hotel booked', {id:'89643e71-e10f-4474-9ac6-3ddd413bfda8'})	);
	student.embedNode(	istar.addGoal(980,358,'Budget hotel booked', {id:'b73684df-4238-47d2-ae5a-e9d88df9559a'})	);
	student.embedNode(	istar.addTask(631,504,'Buy tickets', {id:'1747e206-fa35-4229-b4be-67b3893e84d1'})	);
	student.embedNode(	istar.addTask(758,498,'Pay for tickets', {id:'49da8a06-b243-4c6e-9c50-dded496bec94'})	);
	student.embedNode(	istar.addResource(667,555,'Credit card', {id:'8a867e08-5a70-4816-ab02-1d84cf1b79dd'})	);
	student.embedNode(	istar.addTask(946,446,'Buy through booking.com', {id:'13efea03-96a0-4162-b89e-f46efc9a96c4'})	);
	student.embedNode(	istar.addTask(1042,478,'Buy through hotel website', {id:'59d154e2-8af7-48da-9f55-195ffebab399'})	);
	student.embedNode(	istar.addQuality(543,578,'Comfort', {id:'c8e311fd-2a1a-40f1-b5e5-c62eb3e3a397'})	);
	student.embedNode(	istar.addQuality(911,596,'Minimal own payments', {id:'685e4589-9717-487f-aa94-2eab2f7c5b46'})	);
	student = 	istar.addAgent(205,768,'Univ. trip mgmt IS', {id:'9ebf064b-88e2-48e0-9a63-7adda0ae89d0'})	;
	student.embedNode(	istar.addTask(289,800,'Process form', {id:'ac7c22c2-6538-4fe3-a14f-8f8a2233a472'})	);
	student.embedNode(	istar.addGoal(213,866,'Details validated', {id:'7897dbdc-5dd5-4332-9e31-cac22e01f1e1'})	);
	student.embedNode(	istar.addTask(253,909,'Request authorization', {id:'609eedc5-29e7-4360-b9ad-5ca23076033c'})	);
	student.embedNode(	istar.addTask(339,866,'Notify applicant', {id:'334c70d0-7786-4dda-8340-aa63c921bc03'})	);
	student = 	istar.addRole(105,67,'PhD student', {id:'c7b6f310-8fab-4181-8323-a4190cd35c26'})	;
	student.collapse();
	student = 	istar.addAgent(148,276,'Mike White', {id:'77f4dfe4-1af2-4271-bbfa-0f5892cad0e4'})	;
	student.collapse();
	student = 	istar.addAgent(168,572,'Univ. of Wonder-Land', {id:'a0b5233e-414b-4c96-b87c-45d3167c1ea6'})	;
	student.collapse();
	student = 	istar.addActor(1184,676,'Travel agency', {id:'3c57900f-ba6a-4277-ba86-a688b23628a8'})	;
	student.embedNode(	istar.addTask(1302,694,'Book bundle via expedia', {id:'9544119c-dd79-417e-8a19-6f67455d784b'})	);
	istar.addGoal(327,704,'Online form processed', {id:'fe9bc590-394b-4585-be24-66419eb353b9'})	;
	istar.addGoal(1193,315,'Trip bundle booked', {id:'dc25d9f6-7aea-46fd-8b59-1e317f5017f1'})	;
	istar.addTask(668,800,'Buy flight tickets', {id:'f26ec7d2-3133-42b0-b54c-2b4695e9ee1b'})	;
	istar.addAndRefinementLink(istar.graph.getCell('7897dbdc-5dd5-4332-9e31-cac22e01f1e1'),istar.graph.getCell('ac7c22c2-6538-4fe3-a14f-8f8a2233a472'));
	istar.addAndRefinementLink(istar.graph.getCell('609eedc5-29e7-4360-b9ad-5ca23076033c'),istar.graph.getCell('ac7c22c2-6538-4fe3-a14f-8f8a2233a472'));
	istar.addAndRefinementLink(istar.graph.getCell('334c70d0-7786-4dda-8340-aa63c921bc03'),istar.graph.getCell('ac7c22c2-6538-4fe3-a14f-8f8a2233a472'));
	istar.addIsALink(istar.graph.getCell('c7b6f310-8fab-4181-8323-a4190cd35c26'),istar.graph.getCell('830b5ef8-0f41-4a17-ba2a-ba4a8f4e799b'));
	istar.addParticipatesInLink(istar.graph.getCell('77f4dfe4-1af2-4271-bbfa-0f5892cad0e4'),istar.graph.getCell('c7b6f310-8fab-4181-8323-a4190cd35c26'));
	istar.addAndRefinementLink(istar.graph.getCell('d7350e31-1d29-46b0-bce5-e191189720cd'),istar.graph.getCell('8f5b5975-10bc-44b5-92b2-c53e2394b2c9'));
	istar.addAndRefinementLink(istar.graph.getCell('c3f53c8d-b421-4c60-8dbf-03b07978295b'),istar.graph.getCell('d7350e31-1d29-46b0-bce5-e191189720cd'));
	istar.addAndRefinementLink(istar.graph.getCell('4e767af4-fd1e-4e3e-8a82-3740521e576a'),istar.graph.getCell('d7350e31-1d29-46b0-bce5-e191189720cd'));
	istar.addOrRefinementLink(istar.graph.getCell('191249f9-d249-47db-b5f2-c09449307eb4'),istar.graph.getCell('c3f53c8d-b421-4c60-8dbf-03b07978295b'));
	istar.addOrRefinementLink(istar.graph.getCell('9bb7e927-3dee-4485-8fda-01954d324c88'),istar.graph.getCell('c3f53c8d-b421-4c60-8dbf-03b07978295b'));
	istar.addQualificationLink(istar.graph.getCell('0055d468-1097-43b2-95bf-1781730b1985'),istar.graph.getCell('c3f53c8d-b421-4c60-8dbf-03b07978295b'));
	istar.addOrRefinementLink(istar.graph.getCell('37b28c3f-7554-4c62-91cd-44cac0873977'),istar.graph.getCell('4e767af4-fd1e-4e3e-8a82-3740521e576a'));
	istar.addOrRefinementLink(istar.graph.getCell('102cbb1c-5600-4058-bed9-cc9e1ad1d9e9'),istar.graph.getCell('4e767af4-fd1e-4e3e-8a82-3740521e576a'));
	istar.addContributionLink(istar.graph.getCell('191249f9-d249-47db-b5f2-c09449307eb4'),istar.graph.getCell('0055d468-1097-43b2-95bf-1781730b1985'),'hurt');
	istar.addContributionLink(istar.graph.getCell('9bb7e927-3dee-4485-8fda-01954d324c88'),istar.graph.getCell('0055d468-1097-43b2-95bf-1781730b1985'),'help');
	istar.addContributionLink(istar.graph.getCell('37b28c3f-7554-4c62-91cd-44cac0873977'),istar.graph.getCell('0afa08e3-2306-40c8-9d40-2c144b748664'),'help');
	istar.addContributionLink(istar.graph.getCell('102cbb1c-5600-4058-bed9-cc9e1ad1d9e9'),istar.graph.getCell('0afa08e3-2306-40c8-9d40-2c144b748664'),'break');
	istar.addAndRefinementLink(istar.graph.getCell('16d9b9bf-fdef-4832-8f7d-8dcb42513371'),istar.graph.getCell('8f5b5975-10bc-44b5-92b2-c53e2394b2c9'));
	istar.addOrRefinementLink(istar.graph.getCell('d8991d04-c2a6-45f0-a3ed-3ebed2a2d86d'),istar.graph.getCell('16d9b9bf-fdef-4832-8f7d-8dcb42513371'));
	istar.addOrRefinementLink(istar.graph.getCell('f2ad4e2a-1b6d-44ce-94d7-28aee4e08d3d'),istar.graph.getCell('16d9b9bf-fdef-4832-8f7d-8dcb42513371'));
	istar.addAndRefinementLink(istar.graph.getCell('f34b98b9-6cba-4410-8a49-451e00049e43'),istar.graph.getCell('d8991d04-c2a6-45f0-a3ed-3ebed2a2d86d'));
	istar.addAndRefinementLink(istar.graph.getCell('94b43d28-480c-4a22-92ed-c8ba69a1d111'),istar.graph.getCell('d8991d04-c2a6-45f0-a3ed-3ebed2a2d86d'));
	istar.addOrRefinementLink(istar.graph.getCell('4934265e-abf6-4fe1-91c9-38c2a6aadcb0'),istar.graph.getCell('f34b98b9-6cba-4410-8a49-451e00049e43'));
	istar.addOrRefinementLink(istar.graph.getCell('11d870d2-7987-45c9-a36a-7b177219ae50'),istar.graph.getCell('f34b98b9-6cba-4410-8a49-451e00049e43'));
	istar.addOrRefinementLink(istar.graph.getCell('89643e71-e10f-4474-9ac6-3ddd413bfda8'),istar.graph.getCell('94b43d28-480c-4a22-92ed-c8ba69a1d111'));
	istar.addOrRefinementLink(istar.graph.getCell('b73684df-4238-47d2-ae5a-e9d88df9559a'),istar.graph.getCell('94b43d28-480c-4a22-92ed-c8ba69a1d111'));
	istar.addAndRefinementLink(istar.graph.getCell('1747e206-fa35-4229-b4be-67b3893e84d1'),istar.graph.getCell('11d870d2-7987-45c9-a36a-7b177219ae50'));
	istar.addAndRefinementLink(istar.graph.getCell('49da8a06-b243-4c6e-9c50-dded496bec94'),istar.graph.getCell('11d870d2-7987-45c9-a36a-7b177219ae50'));
	istar.addNeededByLink(istar.graph.getCell('8a867e08-5a70-4816-ab02-1d84cf1b79dd'),istar.graph.getCell('49da8a06-b243-4c6e-9c50-dded496bec94'));
	istar.addOrRefinementLink(istar.graph.getCell('13efea03-96a0-4162-b89e-f46efc9a96c4'),istar.graph.getCell('b73684df-4238-47d2-ae5a-e9d88df9559a'));
	istar.addOrRefinementLink(istar.graph.getCell('59d154e2-8af7-48da-9f55-195ffebab399'),istar.graph.getCell('b73684df-4238-47d2-ae5a-e9d88df9559a'));
	istar.addParticipatesInLink(istar.graph.getCell('9ebf064b-88e2-48e0-9a63-7adda0ae89d0'),istar.graph.getCell('a0b5233e-414b-4c96-b87c-45d3167c1ea6'));
	istar.addQualificationLink(istar.graph.getCell('0afa08e3-2306-40c8-9d40-2c144b748664'),istar.graph.getCell('d8991d04-c2a6-45f0-a3ed-3ebed2a2d86d'));
	istar.addContributionLink(istar.graph.getCell('11d870d2-7987-45c9-a36a-7b177219ae50'),istar.graph.getCell('0afa08e3-2306-40c8-9d40-2c144b748664'),'help');
	istar.addContributionLink(istar.graph.getCell('0afa08e3-2306-40c8-9d40-2c144b748664'),istar.graph.getCell('c8e311fd-2a1a-40f1-b5e5-c62eb3e3a397'),'help');
	istar.addContributionLink(istar.graph.getCell('685e4589-9717-487f-aa94-2eab2f7c5b46'),istar.graph.getCell('c8e311fd-2a1a-40f1-b5e5-c62eb3e3a397'),'help');
	istar.addContributionLink(istar.graph.getCell('4934265e-abf6-4fe1-91c9-38c2a6aadcb0'),istar.graph.getCell('685e4589-9717-487f-aa94-2eab2f7c5b46'),'help');
	istar.addContributionLink(istar.graph.getCell('11d870d2-7987-45c9-a36a-7b177219ae50'),istar.graph.getCell('685e4589-9717-487f-aa94-2eab2f7c5b46'),'hurt');
	istar.addContributionLink(istar.graph.getCell('f2ad4e2a-1b6d-44ce-94d7-28aee4e08d3d'),istar.graph.getCell('685e4589-9717-487f-aa94-2eab2f7c5b46'),'make');
	istar.addDependencyLink(istar.graph.getCell('9bb7e927-3dee-4485-8fda-01954d324c88'), istar.graph.getCell('fe9bc590-394b-4585-be24-66419eb353b9'), istar.graph.getCell('ac7c22c2-6538-4fe3-a14f-8f8a2233a472'));
	istar.addDependencyLink(istar.graph.getCell('f2ad4e2a-1b6d-44ce-94d7-28aee4e08d3d'), istar.graph.getCell('dc25d9f6-7aea-46fd-8b59-1e317f5017f1'), istar.graph.getCell('9544119c-dd79-417e-8a19-6f67455d784b'));
	istar.addDependencyLink(istar.graph.getCell('4934265e-abf6-4fe1-91c9-38c2a6aadcb0'), istar.graph.getCell('f26ec7d2-3133-42b0-b54c-2b4695e9ee1b'), istar.graph.getCell('3c57900f-ba6a-4277-ba86-a688b23628a8'));
	istar.graph.getCell('fe9bc590-394b-4585-be24-66419eb353b9').prop('position/x', 327);
	istar.graph.getCell('fe9bc590-394b-4585-be24-66419eb353b9').prop('position/y', 704);
	istar.graph.getCell('dc25d9f6-7aea-46fd-8b59-1e317f5017f1').prop('position/x', 1193);
	istar.graph.getCell('dc25d9f6-7aea-46fd-8b59-1e317f5017f1').prop('position/y', 315);
	istar.graph.getCell('f26ec7d2-3133-42b0-b54c-2b4695e9ee1b').prop('position/x', 668);
	istar.graph.getCell('f26ec7d2-3133-42b0-b54c-2b4695e9ee1b').prop('position/y', 800);
};

examples.experimentExample = function () {
	console.log('Go drink some water, this will take a while');
	var actor = istar.addActor(23, 23, 'Actor');
	for (var i = 1; i <= 40; i++) {
		 for (var j = 0; j < 25; j++)
		{
			var kindOfElement = examples.util.randomIntegerFromMinToMax(0, 4);
			var x = 10+i*30;
			var y = 10 + j*30;
			var name = 'element ' + (j*40 + i);
			var priority = examples.util.randomIntegerFromMinToMax(1, 101);

			var creationFunction = istar.addGoal;
			if (kindOfElement === 1) creationFunction = istar.addQuality;
			else if (kindOfElement === 2) creationFunction = istar.addTask;
			else if (kindOfElement === 3) creationFunction = istar.addResource;
			var newElement = creationFunction(x, y, name);
			newElement.prop('customProperties/Priority', priority);
			actor.embedNode(newElement);
		}
	}
};

examples.achievabilityExample = function(){
	loadModel("{\n" +
		"  \"actors\": [\n" +
		"    {\n" +
		"      \"id\": \"de78133e-daa8-4484-9038-135003598cc5\",\n" +
		"      \"text\": \"Mobee\",\n" +
		"      \"type\": \"istar.Actor\",\n" +
		"      \"x\": 77,\n" +
		"      \"y\": 124,\n" +
		"      \"nodes\": [\n" +
		"        {\n" +
		"          \"id\": \"3f734e92-ed0c-4152-9001-8f742bbad3db\",\n" +
		"          \"text\": \"G1: Transport info is shared [G3#G4]\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 385,\n" +
		"          \"y\": 151,\n" +
		"          \"customProperties\": {\n" +
		"            \"selected\": \"true\"\n" +
		"          }\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"c7a179f7-b3aa-43e7-92d3-52cbcddf83eb\",\n" +
		"          \"text\": \"G3: Manual data is sent [G9#G8]\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 251,\n" +
		"          \"y\": 244,\n" +
		"          \"customProperties\": {\n" +
		"            \"creationProperty\": \"assertion condition c2 | c3 | c4\"\n" +
		"        }\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"4c01389a-bcde-42f8-8d99-d3b7cbaa2b9f\",\n" +
		"          \"text\": \"G4: Automatic data is sent\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 477,\n" +
		"          \"y\": 245,\n" +
		"          \"customProperties\": {\n" +
		"            \"creationProperty\": \"assertion condition c1 & !c2\"\n" +
		"          }\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"1288f213-9ad0-4d93-a9aa-5d6ca396100d\",\n" +
		"          \"text\": \"G9: Qualification is collected\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 164,\n" +
		"          \"y\": 337,\n" +
		"          \"customProperties\": {\n" +
		"            \"creationProperty\": \"assertion condition c1 | c3\"\n" +
		"          }\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"c281eb93-abc0-4466-b469-698a26b5b82e\",\n" +
		"          \"text\": \"G8: Modification is collected\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 320,\n" +
		"          \"y\": 340\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"6da9a1a8-d22e-45bf-a28e-24a03daeee88\",\n" +
		"          \"text\": \"T1: Track line location\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 478,\n" +
		"          \"y\": 336\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"e8ea7a55-a1ab-4f07-8076-0e61c50d429a\",\n" +
		"          \"text\": \"T1: Process modification\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 327,\n" +
		"          \"y\": 432,\n" +
		"          \"customProperties\": {\n" +
		"            \"creationProperty\": \"assertion condition c2 | c4\"\n" +
		"          }\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"a5b18920-a039-4827-a8ef-ae67f6d881a2\",\n" +
		"          \"text\": \"T1: Process qualification [T1.1;T1.2]\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 165,\n" +
		"          \"y\": 435,\n" +
		"          \"customProperties\": {\n" +
		"            \"creationProperty\": \"assertion condition c2 & c4\"\n" +
		"          }\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"0053dec8-999b-4374-adb2-7a609ccc2396\",\n" +
		"          \"text\": \"T1.1: Testing\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 77,\n" +
		"          \"y\": 537,\n" +
		"          \"customProperties\": {\n" +
		"            \"creationProperty\": \"assertion condition (c1 | c2) & (c3 | c4)\"\n" +
		"          }\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"c45a33b6-fd30-4504-ac3f-12c8095d592f\",\n" +
		"          \"text\": \"T1.2: Exception\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 239,\n" +
		"          \"y\": 541\n" +
		"        }\n" +
		"      ]\n" +
		"    }\n" +
		"  ],\n" +
		"  \"dependencies\": [],\n" +
		"  \"links\": [\n" +
		"    {\n" +
		"      \"id\": \"c538a1b1-d43a-41b3-b5d5-5af1c6fadd35\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"4c01389a-bcde-42f8-8d99-d3b7cbaa2b9f\",\n" +
		"      \"target\": \"3f734e92-ed0c-4152-9001-8f742bbad3db\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"8a4e9eab-fd4b-4a1c-9eed-3f9786da36ee\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"c7a179f7-b3aa-43e7-92d3-52cbcddf83eb\",\n" +
		"      \"target\": \"3f734e92-ed0c-4152-9001-8f742bbad3db\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"2a2de391-9a68-4522-8dda-6fc6128413a6\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"1288f213-9ad0-4d93-a9aa-5d6ca396100d\",\n" +
		"      \"target\": \"c7a179f7-b3aa-43e7-92d3-52cbcddf83eb\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"08f8be20-f8b1-4186-8c27-0c150b757f11\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"c281eb93-abc0-4466-b469-698a26b5b82e\",\n" +
		"      \"target\": \"c7a179f7-b3aa-43e7-92d3-52cbcddf83eb\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"011434e6-550b-4ba9-9142-8262c32bf52e\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"a5b18920-a039-4827-a8ef-ae67f6d881a2\",\n" +
		"      \"target\": \"1288f213-9ad0-4d93-a9aa-5d6ca396100d\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"675744d0-6817-44fb-b75a-b5b35d33891c\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"e8ea7a55-a1ab-4f07-8076-0e61c50d429a\",\n" +
		"      \"target\": \"c281eb93-abc0-4466-b469-698a26b5b82e\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"bb1e7683-9f13-4c90-9379-b254b10a0a38\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"6da9a1a8-d22e-45bf-a28e-24a03daeee88\",\n" +
		"      \"target\": \"4c01389a-bcde-42f8-8d99-d3b7cbaa2b9f\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"14caf2c0-1835-46fd-9b94-055699af8a40\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"0053dec8-999b-4374-adb2-7a609ccc2396\",\n" +
		"      \"target\": \"a5b18920-a039-4827-a8ef-ae67f6d881a2\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"922438bb-af41-4565-ad9c-52d91cf2e0b1\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"c45a33b6-fd30-4504-ac3f-12c8095d592f\",\n" +
		"      \"target\": \"a5b18920-a039-4827-a8ef-ae67f6d881a2\"\n" +
		"    }\n" +
		"  ],\n" +
		"  \"tool\": \"pistar.1.0.0\",\n" +
		"  \"istar\": \"2.0\",\n" +
		"  \"saveDate\": \"Sat, 06 Jan 2018 23:53:39 GMT\",\n" +
		"  \"diagram\": {\n" +
		"    \"width\": 1881,\n" +
		"    \"height\": 1172\n" +
		"  }\n" +
		"}");
	var model = saveModel();
	$.ajax({
		type: "POST",
		url: '/achievability-example',
		data: {
			"content": model
		},
		success: function (data, xhr) {
			alert(data);
		},
		error: function () {
			alert("Error!");
		}
	});
};

examples.mpers = function () {
	loadModel("{\n" +
		"  \"actors\": [\n" +
		"    {\n" +
		"      \"id\": \"3a151d60-5de7-4857-b5a3-5d55d84e70d4\",\n" +
		"      \"text\": \"Actor\",\n" +
		"      \"type\": \"istar.Actor\",\n" +
		"      \"x\": 192,\n" +
		"      \"y\": 71,\n" +
		"      \"nodes\": [\n" +
		"        {\n" +
		"          \"id\": \"cba54c7f-d4a2-4127-9500-361d1f7a1c9b\",\n" +
		"          \"text\": \"G1: Respond to emergency\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 728,\n" +
		"          \"y\": 71\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"2459a35d-7c65-45aa-a1ac-0d95d5c20135\",\n" +
		"          \"text\": \"G2: emergency is detected\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 451,\n" +
		"          \"y\": 193\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"e4234541-6d69-4052-aea3-cdecee80f21d\",\n" +
		"          \"text\": \"G3: is notified about emergency\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 725,\n" +
		"          \"y\": 176\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"6d01fb9a-73dc-41a2-9b37-369ee19bc821\",\n" +
		"          \"text\": \"G6: call for help is accepted\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 348,\n" +
		"          \"y\": 291\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"e399543c-8434-4c0c-ae5f-ed7b0022a9a5\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 646,\n" +
		"          \"y\": 239\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"2a7677aa-85bf-4991-bd4e-d1395df7439f\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 710,\n" +
		"          \"y\": 285\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"dd1922fb-324a-43c1-9940-cfb756059df0\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 810,\n" +
		"          \"y\": 285\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"1bc3839c-78bc-41d3-a210-877a0e04822f\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 843,\n" +
		"          \"y\": 232\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"4498bbda-f3b8-4c05-9c98-bea1d31741be\",\n" +
		"          \"text\": \"G4: central receives info\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 1004,\n" +
		"          \"y\": 234\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"ff953162-160a-4627-ae96-b663eea53534\",\n" +
		"          \"text\": \"G11: recives emergency button call\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 282,\n" +
		"          \"y\": 363\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"8b8a2b21-9ce0-4172-ae92-b41b48f00fe8\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 192,\n" +
		"          \"y\": 464\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"e71af902-cacb-45a5-9517-2ee4a0be1592\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 309,\n" +
		"          \"y\": 472\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"398d7878-79d1-4268-96ec-a36b30325134\",\n" +
		"          \"text\": \"G12: false alarms is checked\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 458,\n" +
		"          \"y\": 461\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"baffc9fa-0ce9-4cf9-bc52-58997444dc25\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 416,\n" +
		"          \"y\": 538\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"c68762d4-8325-4c3a-aa51-5fd199b66e5f\",\n" +
		"          \"text\": \"G16: is contacted\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 542,\n" +
		"          \"y\": 536\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"cfaa55c9-2250-453b-8a12-5a3724583cd2\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 610,\n" +
		"          \"y\": 604\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"5c224df2-4bfa-4c5f-b25c-b7268231cabd\",\n" +
		"          \"text\": \"G7: Situations are identified\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 531,\n" +
		"          \"y\": 297\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"946cd4e2-89ca-40f2-a8cb-13ebfcd8f783\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 469,\n" +
		"          \"y\": 365\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"7d81fd0d-c7b8-42f8-84f2-687c2b53006c\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 626,\n" +
		"          \"y\": 348\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"94198605-ac87-4fe3-a41a-bd133d879e35\",\n" +
		"          \"text\": \"G13: vital signs are monitored\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 575,\n" +
		"          \"y\": 400\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"fd93789b-7af2-4d6d-8776-81b19832f4b2\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 558,\n" +
		"          \"y\": 476\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"83f0e4a4-c0b7-4281-9112-3e6971e0978a\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 676,\n" +
		"          \"y\": 467\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"39fad55f-1807-42d8-903d-dd04f4f8cb6f\",\n" +
		"          \"text\": \"G8: info is sent to emergency\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 958,\n" +
		"          \"y\": 304\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"658f6679-89d2-44b6-bf86-d5d5c3d2eebb\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 803,\n" +
		"          \"y\": 420\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"e520324e-13e2-480c-b3f2-406600cb4897\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 968,\n" +
		"          \"y\": 425\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"350d61aa-aa14-4e40-aefb-d4bba1254a8e\",\n" +
		"          \"text\": \"G9: info is prepared\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 1166,\n" +
		"          \"y\": 306\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"00a9c4e0-94c7-4c41-9108-b5a2bc631853\",\n" +
		"          \"text\": \"G15: contact responsible for\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 1296,\n" +
		"          \"y\": 387\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"9ae56eda-97ec-4597-8321-d337c8033f35\",\n" +
		"          \"text\": \"G14: setup automated info\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 1109,\n" +
		"          \"y\": 432\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"7c1f84d1-9835-4f18-8bcb-9676f64f2b70\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 1262,\n" +
		"          \"y\": 461\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"c4d7c504-c4eb-47d3-b3d2-7b7c64356c44\",\n" +
		"          \"text\": \"G17: location is identified\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 989,\n" +
		"          \"y\": 568\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"765a6e8a-24d8-404e-8120-36daf5c99b43\",\n" +
		"          \"text\": \"G18: situation data is recovered\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 1200,\n" +
		"          \"y\": 555\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"975ecdb9-a2e5-4d6b-9afa-d7b408af6ea8\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 1238,\n" +
		"          \"y\": 624\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"bc72241e-a5b1-4969-a781-8550d22e45a2\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 878,\n" +
		"          \"y\": 615\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"7cad0696-fdc2-4611-9d41-e641d6c55c5c\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 928,\n" +
		"          \"y\": 667\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"c7e26c5f-09e6-430f-92cc-966ccb9a1071\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 1033,\n" +
		"          \"y\": 667\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"ca9807dc-e45c-433e-a87f-6361bca4347b\",\n" +
		"          \"text\": \"Task\",\n" +
		"          \"type\": \"istar.Task\",\n" +
		"          \"x\": 1085,\n" +
		"          \"y\": 618\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"489194fb-5a70-4876-9909-411e78de76e6\",\n" +
		"          \"text\": \"G10: ambulance is dispatched to location\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 1468,\n" +
		"          \"y\": 228\n" +
		"        },\n" +
		"        {\n" +
		"          \"id\": \"577020f0-c5bd-4844-8c7f-ffec33beabce\",\n" +
		"          \"text\": \"G5: medical care reaches\",\n" +
		"          \"type\": \"istar.Goal\",\n" +
		"          \"x\": 1218,\n" +
		"          \"y\": 180\n" +
		"        }\n" +
		"      ]\n" +
		"    }\n" +
		"  ],\n" +
		"  \"dependencies\": [],\n" +
		"  \"links\": [\n" +
		"    {\n" +
		"      \"id\": \"f5c1a2ca-f6c8-4097-98f8-83d61e734b4c\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"e399543c-8434-4c0c-ae5f-ed7b0022a9a5\",\n" +
		"      \"target\": \"e4234541-6d69-4052-aea3-cdecee80f21d\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"f54486a7-8cec-4f40-850e-d1b1e1b91721\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"2a7677aa-85bf-4991-bd4e-d1395df7439f\",\n" +
		"      \"target\": \"e4234541-6d69-4052-aea3-cdecee80f21d\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"79dab48c-d65a-4a20-8418-7cda4a54418e\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"1bc3839c-78bc-41d3-a210-877a0e04822f\",\n" +
		"      \"target\": \"e4234541-6d69-4052-aea3-cdecee80f21d\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"2c3486ca-f4f3-44ed-8de2-8f2a7fae9bf5\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"dd1922fb-324a-43c1-9940-cfb756059df0\",\n" +
		"      \"target\": \"e4234541-6d69-4052-aea3-cdecee80f21d\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"cb0d4e7e-e29f-4d22-b2ea-cc4837c0c5a2\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"8b8a2b21-9ce0-4172-ae92-b41b48f00fe8\",\n" +
		"      \"target\": \"ff953162-160a-4627-ae96-b663eea53534\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"2e0358b7-32f8-41df-8592-3eef37ac9456\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"e71af902-cacb-45a5-9517-2ee4a0be1592\",\n" +
		"      \"target\": \"ff953162-160a-4627-ae96-b663eea53534\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"9c17a8d4-81c9-4740-8064-cf84e17b9c1b\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"ff953162-160a-4627-ae96-b663eea53534\",\n" +
		"      \"target\": \"6d01fb9a-73dc-41a2-9b37-369ee19bc821\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"1ba9ca9e-fdd6-4cff-b682-5d451a3971df\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"6d01fb9a-73dc-41a2-9b37-369ee19bc821\",\n" +
		"      \"target\": \"2459a35d-7c65-45aa-a1ac-0d95d5c20135\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"8fd4c4b0-73b9-45b9-aa8f-aa5045fa0b2d\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"398d7878-79d1-4268-96ec-a36b30325134\",\n" +
		"      \"target\": \"6d01fb9a-73dc-41a2-9b37-369ee19bc821\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"f427ea0d-72c6-49f0-a806-10692a1e9c0e\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"baffc9fa-0ce9-4cf9-bc52-58997444dc25\",\n" +
		"      \"target\": \"398d7878-79d1-4268-96ec-a36b30325134\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"060f9795-b21a-4961-aaca-4e6c550d3cdc\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"c68762d4-8325-4c3a-aa51-5fd199b66e5f\",\n" +
		"      \"target\": \"398d7878-79d1-4268-96ec-a36b30325134\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"3c783db9-f04c-4a9f-b4eb-e2a695fb10e8\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"cfaa55c9-2250-453b-8a12-5a3724583cd2\",\n" +
		"      \"target\": \"c68762d4-8325-4c3a-aa51-5fd199b66e5f\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"36d16925-e444-417e-9a59-9d94530ad117\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"5c224df2-4bfa-4c5f-b25c-b7268231cabd\",\n" +
		"      \"target\": \"2459a35d-7c65-45aa-a1ac-0d95d5c20135\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"80117252-ae19-4940-a913-e766ca890d0d\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"946cd4e2-89ca-40f2-a8cb-13ebfcd8f783\",\n" +
		"      \"target\": \"5c224df2-4bfa-4c5f-b25c-b7268231cabd\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"dd25d613-631b-439b-bcab-747d67e60bd2\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"7d81fd0d-c7b8-42f8-84f2-687c2b53006c\",\n" +
		"      \"target\": \"5c224df2-4bfa-4c5f-b25c-b7268231cabd\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"bd2d0a18-b95a-428f-a3c4-8a450ab49075\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"94198605-ac87-4fe3-a41a-bd133d879e35\",\n" +
		"      \"target\": \"5c224df2-4bfa-4c5f-b25c-b7268231cabd\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"8294c635-f32b-4cd8-a120-4589e3494a75\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"fd93789b-7af2-4d6d-8776-81b19832f4b2\",\n" +
		"      \"target\": \"94198605-ac87-4fe3-a41a-bd133d879e35\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"6859d617-ff39-4850-8efd-35ec70649961\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"83f0e4a4-c0b7-4281-9112-3e6971e0978a\",\n" +
		"      \"target\": \"94198605-ac87-4fe3-a41a-bd133d879e35\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"600fcd5d-855e-456b-bfed-219ad508bdbf\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"2459a35d-7c65-45aa-a1ac-0d95d5c20135\",\n" +
		"      \"target\": \"cba54c7f-d4a2-4127-9500-361d1f7a1c9b\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"8294412d-4729-4a94-a043-94610712feca\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"e4234541-6d69-4052-aea3-cdecee80f21d\",\n" +
		"      \"target\": \"cba54c7f-d4a2-4127-9500-361d1f7a1c9b\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"31340cb5-6c59-4e86-ae77-fd88adb2a197\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"4498bbda-f3b8-4c05-9c98-bea1d31741be\",\n" +
		"      \"target\": \"cba54c7f-d4a2-4127-9500-361d1f7a1c9b\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"ba2c2b3c-232a-4a06-9996-feeac328fbcc\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"658f6679-89d2-44b6-bf86-d5d5c3d2eebb\",\n" +
		"      \"target\": \"39fad55f-1807-42d8-903d-dd04f4f8cb6f\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"68f3b029-3d47-49c6-b714-17d97969304d\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"e520324e-13e2-480c-b3f2-406600cb4897\",\n" +
		"      \"target\": \"39fad55f-1807-42d8-903d-dd04f4f8cb6f\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"a3d4066e-f848-4eae-9191-d25bcda77908\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"39fad55f-1807-42d8-903d-dd04f4f8cb6f\",\n" +
		"      \"target\": \"4498bbda-f3b8-4c05-9c98-bea1d31741be\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"667f93b0-6873-4ff7-9eda-9603c4bd4967\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"9ae56eda-97ec-4597-8321-d337c8033f35\",\n" +
		"      \"target\": \"350d61aa-aa14-4e40-aefb-d4bba1254a8e\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"5aee3b4d-7af2-4eef-998d-3db2152919fa\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"00a9c4e0-94c7-4c41-9108-b5a2bc631853\",\n" +
		"      \"target\": \"350d61aa-aa14-4e40-aefb-d4bba1254a8e\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"eda3a41e-d12e-4099-9564-fd9addd1d1ac\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"350d61aa-aa14-4e40-aefb-d4bba1254a8e\",\n" +
		"      \"target\": \"4498bbda-f3b8-4c05-9c98-bea1d31741be\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"956c2f4d-4eee-4a9d-a713-fd5176144adb\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"7c1f84d1-9835-4f18-8bcb-9676f64f2b70\",\n" +
		"      \"target\": \"00a9c4e0-94c7-4c41-9108-b5a2bc631853\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"e8695ac2-af5b-48cf-8ba1-fc9c1aa4dc5c\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"c4d7c504-c4eb-47d3-b3d2-7b7c64356c44\",\n" +
		"      \"target\": \"9ae56eda-97ec-4597-8321-d337c8033f35\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"0fdf4a01-72b9-4e26-805b-b01d5ce151e9\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"765a6e8a-24d8-404e-8120-36daf5c99b43\",\n" +
		"      \"target\": \"9ae56eda-97ec-4597-8321-d337c8033f35\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"005360bf-8421-45db-80a2-6172ac1c5d76\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"975ecdb9-a2e5-4d6b-9afa-d7b408af6ea8\",\n" +
		"      \"target\": \"765a6e8a-24d8-404e-8120-36daf5c99b43\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"2304e089-f606-41f0-a11d-772a301af5f2\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"bc72241e-a5b1-4969-a781-8550d22e45a2\",\n" +
		"      \"target\": \"c4d7c504-c4eb-47d3-b3d2-7b7c64356c44\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"412792ac-d60b-4524-b883-1af68e695aab\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"7cad0696-fdc2-4611-9d41-e641d6c55c5c\",\n" +
		"      \"target\": \"c4d7c504-c4eb-47d3-b3d2-7b7c64356c44\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"2099e111-d2ca-4e54-9aee-91417e8da701\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"c7e26c5f-09e6-430f-92cc-966ccb9a1071\",\n" +
		"      \"target\": \"c4d7c504-c4eb-47d3-b3d2-7b7c64356c44\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"a4f4dc24-c887-4fbb-998d-ed39b08af4a4\",\n" +
		"      \"type\": \"istar.OrRefinementLink\",\n" +
		"      \"source\": \"ca9807dc-e45c-433e-a87f-6361bca4347b\",\n" +
		"      \"target\": \"c4d7c504-c4eb-47d3-b3d2-7b7c64356c44\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"f6f0a768-8609-49fc-bb76-b737a60db415\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"577020f0-c5bd-4844-8c7f-ffec33beabce\",\n" +
		"      \"target\": \"cba54c7f-d4a2-4127-9500-361d1f7a1c9b\"\n" +
		"    },\n" +
		"    {\n" +
		"      \"id\": \"3f5b4b1e-dd79-491e-a1b7-68d646ddbf9f\",\n" +
		"      \"type\": \"istar.AndRefinementLink\",\n" +
		"      \"source\": \"489194fb-5a70-4876-9909-411e78de76e6\",\n" +
		"      \"target\": \"577020f0-c5bd-4844-8c7f-ffec33beabce\"\n" +
		"    }\n" +
		"  ],\n" +
		"  \"tool\": \"pistar.1.0.0\",\n" +
		"  \"istar\": \"2.0\",\n" +
		"  \"saveDate\": \"Sat, 16 Nov 2019 04:44:26 GMT\",\n" +
		"  \"diagram\": {\n" +
		"    \"width\": 1881,\n" +
		"    \"height\": 1172\n" +
		"  }\n" +
		"}");
};

examples.util = {};
examples.util.randomIntegerFromMinToMax = function(min, max) {
	//min (included)
	//max (excluded)
	return Math.floor(Math.random() * (max - min)) + min;
};
