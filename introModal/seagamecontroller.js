'use strict';
(
	function($, angular, genderStuff) //required dependencies, the config object, the jquery object, and the angular object
	{
		angular.module('seaGameApp').controller
		('gameController', 
			["$scope", "$log", "$modal",
				function($scope, $log, $modal) 
				{
					//Modal For Sea Game Introduction
					$scope.introModalOpen = 
					function()
					{
						$scope.createModalInstanceForSeaGameIntro();
					};

					$scope.createModalInstanceForSeaGameIntro =
					function()
					{
						var modalInstance = $modal.open
						({
							templateUrl: 'introModal/seagameintro.html',
							controller: seaGameIntroModalInstanceCtrl,
							size: 'lg',
							resolve: {
								wantMale: function(){return $scope.setWantMale},
								wantFemale: function(){return $scope.setWantFemale},
								male: function(){return $scope.setMale},
								female: function(){return $scope.setFemale},
								xxxo: function() { return $scope.sexAspectsDecided}
							},
							backdrop: 'static',
							keyboard: false
						});
					};
					//0 female, 1 male
					$scope.gender = 1;
					$scope.wantMaleOrFemale = 0; 
					$scope.isGenderSet = false;
					$scope.isWantSet = false;
					$scope.setWantMale = function()
					{
						$scope.wantMaleOrFemale = 1;
						$log.log($scope.wantMaleOrFemale);
						$scope.isWantSet = true;
					};
					$scope.setWantFemale = function()
					{
						$scope.wantMaleOrFemale = 0;
						$log.log($scope.wantMaleOrFemale);
						$scope.isWantSet = true;
					};
					$scope.setMale = function()
					{
						$scope.gender = 1;
						$log.log($scope.gender);
						$scope.isGenderSet = true;
					};
					$scope.setFemale = function()
					{
						$scope.gender = 0;
						$log.log($scope.gender);
						$scope.isGenderSet = true;
					};
					$scope.sexAspectsDecided = function()
					{
						if($scope.isWantSet && $scope.isGenderSet)
						{
							genderStuff.want = $scope.wantMaleOrFemale;
							genderStuff.is = $scope.gender;
							genderStuff.isSet = true;
						}
					};

					var seaGameIntroModalInstanceCtrl = 
					function ($scope, $modalInstance, wantMale, wantFemale, male, female, xxxo) 
					{
						$scope.iDecided = xxxo;
						$scope.isReady1 = false;
						$scope.isReady2 = false;
						$scope.fBlue = male;
						$scope.fPink = female;
						$scope.fWantFemale = wantFemale;
						$scope.fWantMale = wantMale;
						$scope.blue = 
						function()
						{	
							$scope.fBlue();//male();
							$scope.isReady1 = true;
						};
						$scope.pink = 
						function()
						{
							$scope.fPink();//female();
							$scope.isReady1 = true;
						};
						$scope.wantFemale = 
						function()
						{
							$scope.fWantFemale();//wantFemale();
							$scope.isReady2 = true;
						};
						$scope.wantMale = 
						function()
						{
							$scope.fWantMale();//wantMale();
							$scope.isReady2 = true;
						};

						$scope.errorMessage = false;
						$scope.doneSon = function()
						{
							$modalInstance.close();
						};
						$scope.Phase1 = true;
						$scope.Phse2 = false;
						$scope.Phase3 = false;
						$scope.moveOn1 = function()
						{
							if($scope.isReady1 && $scope.isReady2)
							{
								$scope.iDecided();
								$scope.Phase2 = true;
								$scope.Phase1 = false;
							}
							else
							{
								$scope.errorMessage = true;
							}
						};
						$scope.moveOn2 = function()
						{
							$scope.Phase2 = false;
							$scope.Phase3 = true;
						};
					}

					$scope.introModalOpen();


					$scope.openCelebrityModal =function()
					{
						if(timeToTalk.now)
						{
							$scope.resetWhichCelebrity();
							$scope.updateTalker();
							$scope.createModalInstanceForCelebrity();
						}
						
					};

					$scope.whichCelebrity = {};
					$scope.whichCelebrity.emmaWatson = false;
					$scope.whichCelebrity.meganFox = false;
					$scope.whichCelebrity.georgeClooney = false;
					$scope.whichCelebrity.chrisHemsworth = false;
					$scope.whichCelebrity.catFish = false;

					$scope.resetWhichCelebrity = function()
					{
						$scope.whichCelebrity.emmaWatson = false;
						$scope.whichCelebrity.meganFox = false;
						$scope.whichCelebrity.georgeClooney = false;
						$scope.whichCelebrity.chrisHemsworth = false;
						$scope.whichCelebrity.catFish = false;
					};
					// var timeToTalk = {};
					// timeToTalk.now = false;
					// timeToTalk.talkedAlready = false;
					// timeToTalk.who = null;
					$scope.updateTalker = 
					function()
					{


						if(timeToTalk.who == 1 && $scope.wantMaleOrFemale == 0 )
						{
							$scope.whichCelebrity.emmaWatson = true;
						}
						else 
						{
							if(timeToTalk.who == 1 && $scope.wantMaleOrFemale == 1)
							{
								$scope.whichCelebrity.georgeClooney = true;
							}
							else
							{
								if(timeToTalk.who == 2 && $scope.wantMaleOrFemale == 0)
								{
									$scope.whichCelebrity.meganFox = true;
								}
								else
								{
									if(timeToTalk.who == 2 && $scope.wantMaleOrFemale == 1)
									{
										$scope.whichCelebrity.chrisHemsworth =true;
									}
									else
									{
										$scope.whichCelebrity.catFish = true;
									}
								}
							}
						}
					};

					$scope.createModalInstanceForCelebrity =
					function()
					{
						var modalInstance = $modal.open
						({
							templateUrl: 'introModal/celebrity_partial.html',
							controller: seaGameIntroModalInstanceCtrl,
							size: 'lg',
							resolve: {
								talker: function(){return $scope.whichCelebrity;}
							},
							backdrop: 'static',
							keyboard: false
						});
					};

					var seaGameIntroModalInstanceCtrl = 
					function ($scope, $modalInstance, talker) 
					{
						$scope.georgeClooney = talker.georgeClooney;
						$scope.emmaWatson = talker.emmaWatson;
						$scope.meganFox = talker.meganFox;
						$scope.chrisHemsworth = talker.chrisHemsworth;
						$scope.catFish = talker.catFish;

						$scope.phaseNumber = 0;

						$scope.updatePhaseNumber = 
						function()
						{
							if($scope.georgeClooney)
							{
								$scope.phaseNumber = 6;
							}
							else
							{
								if($scope.emmaWatson)
								{
									$scope.phaseNumber = 5;
								}
								else
								{
									if($scope.meganFox)
									{
										$scope.phaseNumber = 13;
									}
									else
									{
										if($scope.chrisHemsworth)
										{
											$scope.phaseNumber = 8;
										}
										else
										{
											$scope.phaseNumber = 4;
										}
									}
								}
							}
						};

						$scope.currentPhase = 0;	

						$scope.updatePhaseNumber();

						$scope.moveOn= 
						function()
						{
							if($scope.currentPhase < $scope.phaseNumber)
							{
								$scope.currentPhase++;

							}
							else
							{
								$modalInstance.close();
							}
						};
					}

				}
			]
		);
	}
)
(jQuery, angular, genderBender);