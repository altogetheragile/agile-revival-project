
import MainLayout from "@/components/layout/MainLayout";
import TrainingHeader from "@/components/courses/TrainingHeader";
import TrainingScheduleContainer from "@/components/training/TrainingScheduleContainer";

const TrainingSchedule = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <TrainingHeader />
        <TrainingScheduleContainer />
      </div>
    </MainLayout>
  );
};

export default TrainingSchedule;
